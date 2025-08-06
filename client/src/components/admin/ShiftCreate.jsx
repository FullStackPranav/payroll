import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import Navbar from '../navbar';
import '../css/ShiftCreate.css'; 

const ShiftCreate = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState('');
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [shifts, setShifts] = useState([]);
  const token = localStorage.getItem('token');

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/shifts`, {
        name, days, startTime, endTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setDays([]);
      setStartTime('');
      setEndTime('');
      fetchShifts();
    } catch (err) {
      console.error('Error creating shift', err);
    }
  };

  const fetchShifts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/shifts/shifts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(res.data);
    } catch (err) {
      console.error('Error fetching shifts', err);
    }
  };
const handleDeleteShift = async (shiftId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this shift?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/shifts/deleteshift/${shiftId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchShifts(); 
  } catch (err) {
    console.error("Error deleting shift:", err);
  }
};


  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <div className="shift-container">
        <div className="shift-wrapper">
          <div className="form-card">
            <h2 className="form-title">➕ Create New Shift</h2>
            <form onSubmit={handleSubmit} className="shift-form">
              <input
                type="text"
                placeholder="Shift Name"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <div className="checkbox-group">
                <label className="form-label">Select Days:</label>
                <div className="day-checkboxes">
                  {weekdays.map(day => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={days.includes(day)}
                        onChange={() => toggleDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="time-inputs">
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="form-input"
                  required
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="submit-button">Create Shift</button>
            </form>
          </div>

          <div className="table-card">
            <h3 className="table-title">📋 All Shifts</h3>
            <table className="shift-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Days</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, idx) => (
                  <tr key={idx}>
                    <td>{shift.name}</td>
                    <td>{shift.days.join(', ')}</td>
                    <td>{shift.startTime} - {shift.endTime}</td>
                    <td>
        <button
          className="delete-button"
          onClick={() => handleDeleteShift(shift._id)}
        >
          ❌
        </button>
      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShiftCreate;
