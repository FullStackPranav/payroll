import React from 'react';
import logout from '../logout';
import Navbar from '../navbar';

const AdminDashboard = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  return (
    <>
    <Navbar/>
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <button onClick={logout}>Log OUt</button>
    </div>
    </>
  );
};

export default AdminDashboard;
