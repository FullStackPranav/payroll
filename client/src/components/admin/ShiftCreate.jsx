import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShiftCreate = () => {
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
      await axios.post('http://localhost:5000/api/shifts/Shifts', { name, days, startTime, endTime }, {
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
      const res = await axios.get('http://localhost:5000/api/shifts/shifts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(res.data);
    } catch (err) {
      console.error('Error fetching shifts', err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Shift</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Shift Name" value={name} onChange={e => setName(e.target.value)} required />
        <div>
          <label>Days:</label><br />
          {weekdays.map(day => (
            <label key={day} style={{ marginRight: '10px' }}>
              <input type="checkbox" checked={days.includes(day)} onChange={() => toggleDay(day)} />
              {day}
            </label>
          ))}
        </div>
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        <button type="submit">Create Shift</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>All Shifts</h3>
      <ul>
        {shifts.map((shift, idx) => (
          <li key={idx}>
            <strong>{shift.name}</strong>: {shift.days.join(', ')} | {shift.startTime} - {shift.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftCreate;
