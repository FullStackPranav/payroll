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

  if (loading) return <p style={{ padding: '2rem' }}>Loading payslip...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;
  if (!payslip || !payslip.employee) return <p style={{ padding: '2rem' }}>No payslip data available.</p>;

  let serialNo = 1;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />

      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '1.5rem',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <h2 style={{ marginBottom: '1rem' }}>
        Payslip for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
      </h2>

      {/* Payslip Summary Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
        maxWidth: '600px'
      }}>
        <p><strong>Name:</strong> {payslip.employee.name}</p>
        <p><strong>Role:</strong> {payslip.employee.role}</p>
        <p><strong>Hourly Rate:</strong> ₹{payslip.employee.hourlyRate}</p>
        <p><strong>Total Hours Worked:</strong> {payslip.totalHours.toFixed(2)} hrs</p>
        <p><strong>Total Pay:</strong> ₹{payslip.totalPay.toFixed(2)}</p>
      </div>

      {/* Attendance Logs */}
      <h3 style={{ marginBottom: '1rem' }}>Attendance Logs</h3>

      {logs.length === 0 ? (
        <p>No attendance records found for this month.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <thead style={{ background: '#343a40', color: 'white' }}>
              <tr>
                <th style={thStyle}>Sr. No.</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Punch In</th>
                <th style={thStyle}>Login Status</th>
                <th style={thStyle}>Punch Out</th>
                <th style={thStyle}>Logout Status</th>
                <th style={thStyle}>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) =>
                log.punchCycles.map((cycle, j) => {
                  const showDate = j === 0;
                  const showTotalHours = showDate;
                  return (
                    <tr key={`${i}-${j}`} style={{ backgroundColor: j % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={tdStyle}>{serialNo++}</td>
                      <td style={tdStyle}>{showDate ? new Date(log.date).toLocaleDateString() : ''}</td>
                      <td style={tdStyle}>{cycle.punchIn ? new Date(cycle.punchIn).toLocaleTimeString() : '—'}</td>
                      <td style={tdStyle}>{cycle.loginStatus || '—'}</td>
                      <td style={tdStyle}>{cycle.punchOut ? new Date(cycle.punchOut).toLocaleTimeString() : '—'}</td>
                      <td style={tdStyle}>{cycle.logoutStatus || '—'}</td>
                      <td style={tdStyle}>{showTotalHours ? log.totalHours : ''}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #e0e0e0'
};

export default EmployeePayslipDetail;
