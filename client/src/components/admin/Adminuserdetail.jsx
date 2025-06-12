import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import AdminSidebar from './AdminSidebar';
import '../css/AdminUserDetail.css'; // ✅ New CSS file

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState([]);
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, rolesRes, shiftsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/employee-roles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/shifts/shifts', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const userData = userRes.data;
        setUser(userData);
        setStatus(userData.status);
        setSelectedRole(userData.jobRole?._id || '');
        setSelectedShift(userData.shift?._id || '');
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : rolesRes.data.roles || []);
        setShifts(shiftsRes.data);
      } catch (err) {
        console.error('Initial fetch error:', err);
      }
    };
    fetchAll();
  }, [id, token]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance/logs', {
          headers: { Authorization: `Bearer ${token}` },
          params: { id, week, year },
        });
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching logs', err);
      }
    };
    fetchLogs();
  }, [id, token, week, year]);

  const handleStatusChange = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { status: status === 'active' ? 'inactive' : 'active' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setStatus(res.data.user.status);
      alert('Status updated');
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRole) return alert('Please select a role.');
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/assign-job-role`,
        { jobRoleId: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Role assigned!');
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setSelectedRole(res.data.jobRole?._id || '');
    } catch (err) {
      console.error('Error assigning role', err);
    }
  };

  const handleAssignShift = async () => {
    if (!selectedShift) return alert('Please select a shift.');
    try {
      await axios.post(
        'http://localhost:5000/api/shifts/assign-shift',
        { userId: id, shiftId: selectedShift },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Shift assigned!');
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setSelectedShift(res.data.shift?._id || '');
    } catch (err) {
      console.error('Error assigning shift', err);
    }
  };

  if (!user) return <p className="loading-msg">Loading user details...</p>;

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <div className="user-detail-container">
        <div className="user-detail-box">
          <h2>{user.name}'s Profile</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.jobRole ? user.jobRole.name : 'Not assigned'}</p>
          <p><strong>Shift:</strong> {user.shift ? user.shift.name : 'Not assigned'}</p>
          <p><strong>Status:</strong> <span className={`status-tag ${status}`}>{status}</span></p>
          <button className="btn" onClick={handleStatusChange}>
            Set {status === 'active' ? 'Inactive' : 'Active'}
          </button>

          <div className="section">
            <h3>Assign Role</h3>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">-- Select Role --</option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>
                  {role.name} - ₹{role.hourlyRate}/hr
                </option>
              ))}
            </select>
            <button className="btn" onClick={handleAssignRole}>Assign</button>
          </div>

          <div className="section">
            <h3>Assign Shift</h3>
            <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
              <option value="">-- Select Shift --</option>
              {shifts.map(shift => (
                <option key={shift._id} value={shift._id}>
                  {shift.name} ({shift.days.join(', ')}, {shift.startTime} - {shift.endTime})
                </option>
              ))}
            </select>
            <button className="btn" onClick={handleAssignShift}>Assign</button>
          </div>

          <div className="section">
            <h3>Attendance Logs</h3>
            <div className="filters">
              <label>Week:
                <select value={week} onChange={(e) => setWeek(e.target.value)}>
                  <option value="">Last 7 Days</option>
                  {[...Array(52)].map((_, i) => (
                    <option key={i} value={i + 1}>Week {i + 1}</option>
                  ))}
                </select>
              </label>
              <label>Year:
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select Year</option>
                  {[2023, 2024, 2025].map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </label>
            </div>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hours Worked</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.date}</td>
                    <td>
                      {log.hoursWorked} hr{log.hoursWorked !== 1 ? 's' : ''} 
                      {log.minutesWorked > 0 ? ` ${log.minutesWorked} min` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="buttons-row">
            <Link to={`/admin/users/${id}/payslips`} className="btn">View Payslips</Link>
            <button className="btn secondary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUserDetail;
