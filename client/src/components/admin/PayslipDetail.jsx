import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Navbar from '../navbar';
import AdminSidebar from './AdminSidebar';
import '../css/PayslipDetail.css';

const PayslipDetail = () => {
  const { id, year, month } = useParams();
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [editHours, setEditHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const payslipRef = useRef();

  const today = new Date();
  const viewedDate = new Date(year, month - 1);
  const isPayslipGenerated = viewedDate < new Date(today.getFullYear(), today.getMonth());

  const handleDownloadPDF = () => {
    if (!isPayslipGenerated) return;

    const element = payslipRef.current;
    const opt = {
      margin: 0.3,
      filename: `payslip_${data.employee.name}_${year}_${month}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

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
        setError(err.response?.data?.message || 'Error fetching payslip data');
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
        setEditHours({});
      } catch (err) {
        console.error('Error fetching attendance logs', err);
        setError(err.response?.data?.message || 'Error fetching attendance logs');
      } finally {
        setLoading(false);
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
    if (isNaN(newHours)) {
      alert('Please enter a valid number for hours.');
      return;
    }

    if (newHours < 0) {
      alert('Hours cannot be negative.');
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/attendance/${attendanceId}/adjust-hours`, {
        workedHours: newHours
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Hours updated successfully');

      const refreshed = await axios.get(`http://localhost:5000/api/attendance/${id}/monthly-logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month }
      });
      setLogs(refreshed.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setEditHours({});

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

  const calculateDailyHours = (punchCycles) => {
    return punchCycles.reduce((sum, cycle) => {
      if (cycle.punchIn && cycle.punchOut) {
        const inTime = new Date(cycle.punchIn);
        const outTime = new Date(cycle.punchOut);
        return sum + (outTime - inTime) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);
  };

  if (loading) return <p className="payslip-loading">Loading payslip...</p>;
  if (error) return <p className="payslip-error">{error}</p>;
  if (!data) return <p className="payslip-error">No payslip data available.</p>;

  let serialNo = 1;

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <div className="payslip-container">
        <div className="download-btn-wrapper" style={{ textAlign: 'right', marginBottom: '1rem' }}>
          {isPayslipGenerated ? (
            <button onClick={handleDownloadPDF} className="action-button payslip-button">
              Download as PDF
            </button>
          ) : (
            <p className="pending-warning" style={{ color: 'red', fontWeight: 'bold' }}>
              Payslip is still pending. PDF download will be available once the month is over.
            </p>
          )}
        </div>

        <div ref={payslipRef} className="pdf-content-wrapper">
          <h2 className="payslip-header">{data.employee.name}'s Payslip for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</h2>
          <p><strong>Status:</strong> {isPayslipGenerated ? 'Generated' : 'Pending'}</p>

          <div className="payslip-summary">
            <p><strong>Role:</strong> {data.employee.role}</p>
            <p><strong>Hourly Rate:</strong> ₹{data.employee.hourlyRate}</p>
            <p><strong>Total Hours Worked:</strong> {data.totalHours} hrs</p>
            <p><strong>Total Pay:</strong> ₹{data.totalPay}</p>
          </div>

          <h3>Detailed Attendance Logs</h3>

          {logs.length === 0 ? (
            <p>No attendance records found for this month.</p>
          ) : (
            <table className="payslip-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Date</th>
                  <th>Punch In</th>
                  <th>Login Status</th>
                  <th>Punch Out</th>
                  <th>Logout Status</th>
                  <th>Hours Worked</th>
                  <th className="no-print">Edit Hours</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const dateStr = new Date(log.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const dailyHours = calculateDailyHours(log.punchCycles);

                  return (
                    <React.Fragment key={log._id}>
                      {log.punchCycles.map((cycle, j) => (
                        <tr key={`${log._id}-${j}`}>
                          <td>{j === 0 ? serialNo++ : ''}</td>
                          <td>{j === 0 ? dateStr : ''}</td>
                          <td>{cycle.punchIn ? new Date(cycle.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                          <td>{cycle.loginStatus || '—'}</td>
                          <td>{cycle.punchOut ? new Date(cycle.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                          <td>{cycle.logoutStatus || '—'}</td>
                          <td>{j === 0 ? dailyHours.toFixed(2) : ''}</td>
                          <td className="no-print"></td>
                        </tr>
                      ))}
                      <tr className="edit-row no-print">
                        <td colSpan="6" style={{ textAlign: 'right', fontStyle: 'italic' }}>
                          Edit Worked Hours for {dateStr}:
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={editHours[log._id] ?? ''}
                            onChange={(e) => handleInputChange(log._id, e.target.value)}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <button className="edit-button" onClick={() => handleSave(log._id)}>Save</button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <button className="back-button no-print" onClick={() => navigate(-1)}>Back</button>
      </div>
    </>
  );
};

export default PayslipDetail;