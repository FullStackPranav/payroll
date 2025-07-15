import React, { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar';
import EmployeeSidebar from './EmployeeSidebar';
import '../css/EmployeePayslipDetail.css';

const EmployeePayslipDetail = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const payslipRef = useRef();
  const queryParams = new URLSearchParams(location.search);
  const year = parseInt(queryParams.get('year'));
  const month = parseInt(queryParams.get('month'));

  const [payslip, setPayslip] = useState(null);
  const [logs, setLogs] = useState([]);
  const [leaveDays, setLeaveDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const [complianceStats, setComplianceStats] = useState({
    onTimeLogins: 0,
    lateLogins: 0,
    onTimeLogouts: 0,
    earlyLogouts: 0,
    completeShifts: 0,
    missedPunches: 0,
    totalDaysWorked: 0
  });

  const [expandedDates, setExpandedDates] = useState({});

  const today = new Date();
  const viewedDate = new Date(year, month - 1);
  const isPayslipGenerated = viewedDate < new Date(today.getFullYear(), today.getMonth());

  const handleDownloadPDF = () => {
    if (!isPayslipGenerated) return;

    const element = payslipRef.current;
    const opt = {
      margin: 0.3,
      filename: `payslip_${year}_${month}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const toggleExpand = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!year || !month) {
        setError('Year and month must be specified.');
        setLoading(false);
        return;
      }

      try {
        const [payslipRes, logsRes, leavesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/employee/payslip/me`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year, month }
          }),
          axios.get(`${API_BASE_URL}/api/attendance/me/monthly-logs`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year, month }
          }),
          axios.get(`${API_BASE_URL}/api/leaves/me/approved`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year, month }
          })
        ]);

        setPayslip(payslipRes.data);

        const sortedLogs = logsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(sortedLogs);

        setLeaveDays(leavesRes.data.totalLeaveDays || 0);

        const stats = {
          onTimeLogins: 0,
          lateLogins: 0,
          onTimeLogouts: 0,
          earlyLogouts: 0,
          completeShifts: 0,
          missedPunches: 0,
          totalDaysWorked: 0
        };

        sortedLogs.forEach(log => {
          if (log.punchCycles.length > 0) stats.totalDaysWorked += 1;

          let hasLogin = false;
          let hasLogout = false;
          let complete = true;

          log.punchCycles.forEach(cycle => {
            if (cycle.loginStatus === 'On Time') {
              stats.onTimeLogins += 1;
              hasLogin = true;
            } else if (cycle.loginStatus === 'Late') {
              stats.lateLogins += 1;
              hasLogin = true;
            }

            if (cycle.logoutStatus === 'On Time') {
              stats.onTimeLogouts += 1;
              hasLogout = true;
            } else if (cycle.logoutStatus === 'Early') {
              stats.earlyLogouts += 1;
              hasLogout = true;
            }

            if (cycle.loginStatus !== 'On Time' || cycle.logoutStatus !== 'On Time') {
              complete = false;
            }
          });

          if (complete && log.punchCycles.length > 0) stats.completeShifts += 1;
          if (!hasLogin || !hasLogout) stats.missedPunches += 1;
        });

        setComplianceStats(stats);
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

  if (loading) return <p className="employee-payslip-loading">Loading payslip...</p>;
  if (error) return <p className="employee-payslip-error">{error}</p>;
  if (!payslip || !payslip.employee) return <p className="employee-payslip-error">No payslip data available.</p>;

  return (
    <>
      <Navbar />
      <div className="employee-payslip-layout">
        <EmployeeSidebar />

        <div className="employee-payslip-container">
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
            <h2>
              Payslip for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
            </h2>
            <p><strong>Status:</strong> {isPayslipGenerated ? 'Generated' : 'Pending'}</p>

            <div className="payslip-summary">
              <p><strong>Name:</strong> {payslip.employee.name}</p>
              <p><strong>Role:</strong> {payslip.employee.role}</p>
              <p><strong>Hourly Rate:</strong> ₹{payslip.employee.hourlyRate}</p>
              <p><strong>Total Hours Worked:</strong> {payslip.totalHours.toFixed(2)} hrs</p>
              <p><strong>Total Days Worked:</strong> {complianceStats.totalDaysWorked}</p>
              <p><strong>Leave Days (Approved):</strong> {leaveDays}</p>
              <p><strong>Total Pay:</strong> ₹{payslip.totalPay.toFixed(2)}</p>
            </div>

            <h3>Compliance Summary</h3>
            <ul>
              <li>✅ On Time Logins: {complianceStats.onTimeLogins}</li>
              <li>⏰ Late Logins: {complianceStats.lateLogins}</li>
              <li>✅ On Time Logouts: {complianceStats.onTimeLogouts}</li>
              <li>⏳ Early Logouts: {complianceStats.earlyLogouts}</li>
              <li>📋 Complete Shifts: {complianceStats.completeShifts}</li>
              <li>⚠️ Missed Punches: {complianceStats.missedPunches}</li>
            </ul>

            <h3>Detailed Attendance Logs</h3>
            {logs.length === 0 ? (
              <p>No logs found for this month.</p>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Punch In</th>
                    <th>Login Status</th>
                    <th>Punch Out</th>
                    <th>Logout Status</th>
                    <th>Hours Worked</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => {
                    const formattedDate = new Date(log.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                    const isExpanded = expandedDates[log.date];
                    const dailyHours = calculateDailyHours(log.punchCycles);

                    return (
                      <React.Fragment key={index}>
                        <tr className="date-toggle-row" onClick={() => toggleExpand(log.date)}>
                          <td>
                            <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▶</span>
                          </td>
                          <td colSpan="5"><strong>{formattedDate}</strong></td>
                          <td><strong>{dailyHours.toFixed(2)}</strong></td>
                        </tr>

                        {isExpanded && log.punchCycles.map((cycle, j) => (
                          <tr key={`${index}-${j}`} className="cycle-row">
                            <td></td>
                            <td></td>
                            <td>{cycle.punchIn ? new Date(cycle.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                            <td>{cycle.loginStatus || '—'}</td>
                            <td>{cycle.punchOut ? new Date(cycle.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                            <td>{cycle.logoutStatus || '—'}</td>
                            <td></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeePayslipDetail;
