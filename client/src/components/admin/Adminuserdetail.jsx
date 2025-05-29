import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState([]);
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error('Error fetching user', err);
      }
    };

    fetchUser();
  }, [id, token]);

  const handleStatusChange = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { status: status === 'active' ? 'inactive' : 'active' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(res.data.user);
      setStatus(res.data.user.status);
      alert('Status updated');
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance/logs', {
          headers: { Authorization: `Bearer ${token}` },
          params: { id, week, year }
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };
    fetchLogs();
  }, [id, token, week, year]);

  if (!user) return <p>Loading user details...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{user.name}'s Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {status}</p>
      <button onClick={handleStatusChange}>
        Set {status === 'active' ? 'Inactive' : 'Active'}
      </button>

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
              <td style={{ border: "1px solid black", padding: "8px" }}>{log.hoursWorked} hrs</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default AdminUserDetail;
