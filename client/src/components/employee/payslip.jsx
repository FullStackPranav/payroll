import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar';
import dayjs from 'dayjs';

const EmployeePayslipDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');
  const month = queryParams.get('month');

  const [payslip, setPayslip] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!year || !month) {
        setError('Year and month must be specified.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/employee/payslip/me', {
          headers: { Authorization: `Bearer ${token}` },
          params: { year, month }
        });
        setPayslip(response.data);

        const res = await axios.get('http://localhost:5000/api/attendance/me/monthly-logs', {
          headers: { Authorization: `Bearer ${token}` },
          params: { year, month }
        });
        const sortedLogs = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(sortedLogs);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setPayslip(null);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, token]);

  if (loading) return <p>Loading payslip...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!payslip || !payslip.employee) return <p>No payslip data available.</p>;

  let serialNo = 1; // For serial number rows

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        ← Back
      </button>

      <h2>
        Payslip for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
      </h2>
      <p><strong>Name:</strong> {payslip.employee.name}</p>
      <p><strong>Role:</strong> {payslip.employee.role}</p>
      <p><strong>Hourly Rate:</strong> ₹{payslip.employee.hourlyRate}</p>
      <p><strong>Total Hours Worked:</strong> {payslip.totalHours.toFixed(2)} hrs</p>
      <p><strong>Total Pay:</strong> ₹{payslip.totalPay.toFixed(2)}</p>

      <h3 style={{ marginTop: '2rem' }}>Detailed Attendance Logs</h3>

      {logs.length === 0 ? (
        <p>No attendance records found for this month.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}
        >
          <thead style={{ background: '#f0f0f0' }}>
            <tr>
              <th>Sr. No.</th> {/* Added serial no header */}
              <th>Date</th>
              <th>Punch In</th>
              <th>Login Status</th>
              <th>Punch Out</th>
              <th>Logout Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) =>
              log.punchCycles.map((cycle, j) => {
                const showDate = j === 0; // Show date and total hours only on first punch cycle of the day
                const showTotalHours = showDate;
                return (
                  <tr key={`${i}-${j}`}>
                    <td>{serialNo++}</td> {/* Serial no. increment */}
                    <td>{showDate ? new Date(log.date).toLocaleDateString() : ''}</td>
                    <td>{cycle.punchIn ? new Date(cycle.punchIn).toLocaleTimeString() : '—'}</td>
                    <td>{cycle.loginStatus || '—'}</td>
                    <td>{cycle.punchOut ? new Date(cycle.punchOut).toLocaleTimeString() : '—'}</td>
                    <td>{cycle.logoutStatus || '—'}</td>
                    <td>{showTotalHours ? log.totalHours : ''}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeePayslipDetail;
