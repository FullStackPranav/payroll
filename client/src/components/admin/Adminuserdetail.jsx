import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar';

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
    if (!selectedRole) return alert('Please select a role before assigning.');
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/assign-job-role`,
        { jobRoleId: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job role assigned successfully!');
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setSelectedRole(res.data.jobRole?._id || '');
    } catch (err) {
      console.error('Error assigning role', err);
      alert('Failed to assign role');
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
      alert('Shift assigned successfully!');
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setSelectedShift(res.data.shift?._id || '');
    } catch (err) {
      console.error('Error assigning shift', err);
      alert('Failed to assign shift');
    }
  };

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

  if (!user) return <p>Loading user details...</p>;

  return (
    <div style={{ padding: '2rem' }}>
        <Navbar/>
      <h2>{user.name}'s Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.jobRole ? user.jobRole.name : 'Not Assigned'}</p>
      <p><strong>Assigned Shift:</strong> {user.shift ? user.shift.name : 'Not Assigned'}</p>
      <p><strong>Status:</strong> {status}</p>

      <button onClick={handleStatusChange}>
        Set {status === 'active' ? 'Inactive' : 'Active'}
      </button>

      <br /><br />

      <h3>Assign Job Role</h3>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      >
        <option value="">-- Select Role --</option>
        {roles.map((role) => (
          <option key={role._id} value={role._id}>
            {role.name} - ₹{role.hourlyRate}/hr
          </option>
        ))}
      </select>
      <button onClick={handleAssignRole}>Assign Role</button>

      <br /><br />

      <h3>Assign Shift</h3>
      <select
        value={selectedShift}
        onChange={(e) => setSelectedShift(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      >
        <option value="">-- Select Shift --</option>
        {shifts.map((shift) => (
          <option key={shift._id} value={shift._id}>
            {shift.name} ({shift.days.join(', ')}, {shift.startTime} - {shift.endTime})
          </option>
        ))}
      </select>
      <button onClick={handleAssignShift}>Assign Shift</button>

      <br /><br />
      <h3>Attendance Logs</h3>

      <div style={{ marginBottom: "1rem" }}>
        <label>Week: </label>
        <select value={week} onChange={(e) => setWeek(e.target.value)}>
          <option value="">Last 7 Days</option>
          {[...Array(52)].map((_, i) => (
            <option key={i + 1} value={i + 1}>Week {i + 1}</option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Year: </label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          {[2023, 2024, 2025].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{log.date}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {log.hoursWorked} hr{log.hoursWorked !== 1 ? 's' : ''}
                {log.minutesWorked > 0 ? ` ${log.minutesWorked} min` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <Link to={`/admin/users/${id}/payslips`}>
        <button>View Payslips</button>
      </Link>
      <button onClick={() => navigate(-1)} style={{ marginLeft: "1rem" }}>
        Go Back
      </button>
    </div>
  );
};

export default AdminUserDetail;
