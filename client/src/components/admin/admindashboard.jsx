import React from 'react';
import logout from '../logout';
import Navbar from '../navbar';
import AdminUserList from './adminviewusers';
import { Link } from 'react-router';

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
      

<Link to="/adminviewusers">
  <button>View Users</button>
</Link>
<br></br>
<Link to="/adminviewroles">
  <button>View Roles</button>
</Link>
<br></br>
      <button onClick={logout}>Log OUt</button>
    </div>
    </>
  );
};

export default AdminDashboard;
