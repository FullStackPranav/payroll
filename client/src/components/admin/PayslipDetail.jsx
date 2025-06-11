import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar';

const PayslipDetail = () => {
  const { id, year, month } = useParams();
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [editHours, setEditHours] = useState({});
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
        const sortedLogs = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(sortedLogs);
        setEditHours({}); // Reset edit state to blank
      } catch (err) {
        console.error('Error fetching attendance logs', err);
      }
    };

    fetchPayslip();
    fetchLogs();
  }, [id, year, month, token]);

  const handleInputChange = (id, value) => {
    setEditHours(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = async (attendanceId) => {
    const newHours = parseFloat(editHours[attendanceId]);
    if (isNaN(newHours) || newHours < 0) {
      alert('Please enter a valid non-negative number for hours.');
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/attendance/${attendanceId}/adjust-hours`, {
        workedHours: newHours
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Hours updated successfully');

      // Refresh logs and payslip
      const refreshed = await axios.get(`http://localhost:5000/api/attendance/${id}/monthly-logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month }
      });
      setLogs(refreshed.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setEditHours({}); // Reset input fields

      const updatedPayslip = await axios.get(`http://localhost:5000/api/users/${id}/payslip`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month }
      });
      setData(updatedPayslip.data);
    } catch (err) {
      console.error('Error updating worked hours:', err);
      alert('Failed to update hours');
    }
  };

  if (!data) return <p>Loading payslip...</p>;

  let serialNo = 1;

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>{data.employee.name}'s Payslip for {new Date(data.year, data.month - 1).toLocaleString('default', { month: 'long' })} {data.year}</h2>
      <p><strong>Role:</strong> {data.employee.role}</p>
      <p><strong>Hourly Rate:</strong> ₹{data.employee.hourlyRate}</p>
      <p><strong>Total Hours Worked:</strong> {data.totalHours} hrs</p>
      <p><strong>Total Pay:</strong> ₹{data.totalPay}</p>

      <h3 style={{ marginTop: '2rem' }}>Detailed Attendance Logs</h3>

      {logs.length === 0 ? (
        <p>No attendance records found for this month.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
          <thead style={{ background: '#f0f0f0' }}>
            <tr>
              <th>Sr. No.</th>
              <th>Date</th>
              <th>Punch In</th>
              <th>Login Status</th>
              <th>Punch Out</th>
              <th>Logout Status</th>
              <th>Current Hours</th>
              <th>Edit Hours</th>
              
            </tr>
          </thead>
          <tbody>
  {logs.map((log, i) => {
    const dateStr = new Date(log.date).toLocaleDateString();
    return (
      <React.Fragment key={log._id}>
        {/* Row 1: Show punches and current hours */}
        {log.punchCycles.map((cycle, j) => (
          <tr key={`${log._id}-${j}`}>
            <td>{serialNo++}</td>
            <td>{j === 0 ? dateStr : ''}</td>
            <td>{cycle.punchIn ? new Date(cycle.punchIn).toLocaleTimeString() : '—'}</td>
            <td>{cycle.loginStatus || '—'}</td>
            <td>{cycle.punchOut ? new Date(cycle.punchOut).toLocaleTimeString() : '—'}</td>
            <td>{cycle.logoutStatus || '—'}</td>
            <td>{j === 0 ? log.workedHours || '—' : ''}</td>
            <td>{''}</td>
          </tr>
        ))}

        {/* Row 2: Show editable input */}
        <tr style={{ backgroundColor: '#f9f9f9' }}>
          <td colSpan="6" style={{ textAlign: 'right', fontStyle: 'italic' }}>Edit Worked Hours for {dateStr}:</td>
          <td>
            <input
              type="number"
              min="0"
              step="0.1"
              value={editHours[log._id] ?? ''}
              onChange={(e) => handleInputChange(log._id, e.target.value)}
              style={{ width: '80px' }}
            />
          </td>
          <td>
            <button onClick={() => handleSave(log._id)}>Save</button>
          </td>
        </tr>
      </React.Fragment>
    );
  })}
</tbody>

        </table>
      )}
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>Back</button>
    </div>
  );
};

export default PayslipDetail;
