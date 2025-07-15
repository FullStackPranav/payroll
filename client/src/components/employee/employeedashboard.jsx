import React, { useEffect, useState } from 'react';
import logout from '../logout';
import axios from 'axios';
import Navbar from '../navbar';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import '../css/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const photo = localStorage.getItem('photo');
  const shift = JSON.parse(localStorage.getItem('shift'));
  const navigate = useNavigate();

  const punchIn = async () => {
    try {
      const res = await axios.post('${API_BASE_URL}/api/attendance/punchin', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error punching in');
    }
  };

  const punchOut = async () => {
    try {
      const res = await axios.post('${API_BASE_URL}/api/attendance/punchout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error punching out');
    }
  };

  useEffect(() => {
    const now = new Date();
    const firstJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now - firstJan) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((numberOfDays + firstJan.getDay() + 1) / 7);

    if (!week) setWeek(currentWeek.toString());
    if (!year) setYear(now.getFullYear().toString());
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        if (week && year) {
          config.params = { week, year };
        }

        const res = await axios.get(`${API_BASE_URL}/api/attendance/logs`, config);
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };

    // Always fetch if week and year are defined (or if week is "")
    fetchLogs();
  }, [week, year]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <Navbar />
      <EmployeeSidebar />

      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-hero">
            <img
              src={`${API_BASE_URL}/${photo && photo !== 'undefined' ? photo : 'uploads/default.png'}`}
              alt={name}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem'
              }}
            />
            <div className="hero-title">Welcome, <span className="hero-name">{name}</span></div>
            <div className="hero-subtitle">Here’s your attendance overview</div>
            <div className="hero-email">{email}</div>
            {shift ? (
              <div className='hero-shift'>
                Shift: {shift.name} ({shift.startTime} - {shift.endTime})
              </div>
            ) : (
              <div className='hero-shift'>Shift: Not Assigned</div>
            )}
          </div>

          <div className="action-buttons-section">
            <button onClick={punchIn} className="action-button punch-in-button">Punch In</button>
            <button onClick={punchOut} className="action-button punch-out-button">Punch Out</button>
          </div>

          {message && (
            <div className={`message-box ${message.includes("Error") ? 'error-message' : 'success-message'}`}>
              {message}
            </div>
          )}

          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Week:</label>
              <select className="filter-select" value={week} onChange={(e) => setWeek(e.target.value)}>
                <option value="">Last 7 Days</option>
                {[...Array(52)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Year:</label>
              <select className="filter-select" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>
                {[2023, 2024, 2025].map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hours Worked</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td>{new Date(log.date).toLocaleDateString()}</td>
                      <td>
                        {log.hoursWorked > 0 ? `${log.hoursWorked} hr${log.hoursWorked > 1 ? 's' : ''}` : ''}
                        {log.minutesWorked > 0 ? ` ${log.minutesWorked} min${log.minutesWorked > 1 ? 's' : ''}` : (log.hoursWorked === 0 ? '0 mins' : '')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="no-logs-message">No logs found for this selection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/employee/payslips')} className="action-button payslip-button">
              View Payslip
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
