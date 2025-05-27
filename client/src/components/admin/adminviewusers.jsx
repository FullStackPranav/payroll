import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ NEW

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, users]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Users</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', marginBottom: '1rem', width: '100%' }}
      />
      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Role</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status</th> {/* ✅ NEW */}
          </tr>
        </thead>
        <tbody>
          {filtered.map((user, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {/* ✅ Make name clickable */}
                <Link to={`/admin/users/${user._id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                  {user.name}
                </Link>
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.role}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.status}</td> {/* ✅ NEW */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
