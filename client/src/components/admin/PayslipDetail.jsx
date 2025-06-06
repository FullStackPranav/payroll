import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const PayslipDetail = () => {
  const { id, year, month } = useParams();
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}/payslip`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year, month }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching payslip', err);
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/${id}/monthly-logs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year, month }
        });
        // Sort logs by date ascending
        const sortedLogs = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(sortedLogs);
      } catch (err) {
        console.error('Error fetching attendance logs', err);
      }
    };

    fetchPayslip();
    fetchLogs();
  }, [id, year, month, token]);

  if (!data) return <p>Loading payslip...</p>;

  // Group consecutive days
  const groupLogs = () => {
    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < logs.length; i++) {
      const current = logs[i];
      const prev = logs[i - 1];

      if (
        i === 0 ||
        dayjs(current.date).diff(dayjs(prev.date), 'day') === 1
      ) {
        currentGroup.push(current);
      } else {
        groups.push(currentGroup);
        currentGroup = [current];
      }
    }

    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  };

  const groupedLogs = groupLogs();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{data.employee.name}'s Payslip for {new Date(data.year, data.month - 1).toLocaleString('default', { month: 'long' })} {data.year}</h2>
      <p><strong>Role:</strong> {data.employee.role}</p>
      <p><strong>Hourly Rate:</strong> ₹{data.employee.hourlyRate}</p>
      <p><strong>Total Hours Worked:</strong> {data.totalHours} hrs</p>
      <p><strong>Total Pay:</strong> ₹{data.totalPay}</p>

      <h3 style={{ marginTop: '2rem' }}>Detailed Attendance Logs</h3>

      {logs.length === 0 ? (
        <p>No attendance records found for this month.</p>
      ) : (
        groupedLogs.map((group, groupIndex) => (
          <table key={groupIndex} border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
            <thead style={{ background: '#f0f0f0' }}>
              <tr>
                <th colSpan="6" style={{ textAlign: 'left' }}>
                  Week Block {groupIndex + 1} ({dayjs(group[0].date).format("MMM D")} to {dayjs(group[group.length - 1].date).format("MMM D")})
                </th>
              </tr>
              <tr>
                <th>Date</th>
                <th>Punch In</th>
                <th>Login Status</th>
                <th>Punch Out</th>
                <th>Logout Status</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {group.map((log, i) =>
                log.punchCycles.map((cycle, j) => (
                  <tr key={`${groupIndex}-${i}-${j}`}>
                    <td>{j === 0 ? new Date(log.date).toLocaleDateString() : ''}</td>
                    <td>{cycle.punchIn ? new Date(cycle.punchIn).toLocaleTimeString() : '—'}</td>
                    <td>{cycle.loginStatus || '—'}</td>
                    <td>{cycle.punchOut ? new Date(cycle.punchOut).toLocaleTimeString() : '—'}</td>
                    <td>{cycle.logoutStatus || '—'}</td>
                    <td>{j === 0 ? log.totalHours : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ))
      )}
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>Back</button>
    </div>
  );
};

export default PayslipDetail;
