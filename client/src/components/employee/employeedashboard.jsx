import React, { useEffect, useState } from 'react';
import logout from '../logout';
import axios from 'axios';
import Navbar from '../navbar';
import { useNavigate } from 'react-router-dom'; // ✅ Correct import

const EmployeeDashboard = () => {
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  const navigate = useNavigate(); // ✅ Correct usage

  const punchIn = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/punchin', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error punching in');
    }
  };

  const punchOut = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/punchout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error punching out');
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance/logs', {
          headers: { Authorization: `Bearer ${token}` },
          params: { week, year }
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };
    fetchLogs();
  }, [week, year]);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Employee Dashboard</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button onClick={punchIn}>Punch In</button><br />
        <button onClick={punchOut}>Punch Out</button><br />

        <h3>Attendance Logs</h3>

        {/* Week and Year Selectors */}
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
                  {log.hoursWorked > 0 ? `${log.hoursWorked} hr${log.hoursWorked > 1 ? 's' : ''}` : ''}
                  {log.minutesWorked > 0 ? ` ${log.minutesWorked} min${log.minutesWorked > 1 ? 's' : ''}` : (log.hoursWorked === 0 ? '0 mins' : '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View Payslip Button */}
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate('/employee/payslips')}>View Payslip</button>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
