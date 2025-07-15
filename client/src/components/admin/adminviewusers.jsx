import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import AdminSidebar from './AdminSidebar';
import '../css/AdminUserList.css'; 

const AdminUserList = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const navigate=useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/all`, {
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
    <>
      <Navbar />
      <AdminSidebar />
    
      <div className="userlist-container">
        <div className="userlist-wrapper">
          <h2 className="userlist-title">👥 All Users</h2>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="userlist-search"
          />
          <table className="userlist-table">
            <thead>
              <tr>
                <th>Photo & Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="user-info">
                      <img
                        src={`http://localhost:5000/${user.photo || 'uploads/default.png'}`}
                        alt={user.name}
                        className="user-avatar"
                      />
                      <Link to={`/admin/users/${user._id}`} className="user-link">
                        {user.name}
                      </Link>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.jobRole?.name || 'Not assigned'}</td>
                  <td>
                    <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                  <button className='back-button' onClick={()=> navigate(-1)}>Back</button>

        </div>
      </div>
    </>
  );
};

export default AdminUserList;
