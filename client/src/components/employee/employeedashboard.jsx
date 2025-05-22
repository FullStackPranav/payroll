import React, { useState } from 'react';
import logout from '../logout';
import axios from 'axios';
import Navbar from '../navbar';

const EmployeeDashboard = () => {
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

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

  return (
    <>
    <Navbar/>

    <div style={{ padding: '2rem' }}>
      <h2>Employee Dashboard</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button onClick={punchIn}>Punch In</button><br />
      <button onClick={punchOut}>Punch Out</button><br />
      
    </div>
    </>
  );
};

export default EmployeeDashboard;
