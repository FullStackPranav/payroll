import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error('Error fetching user', err);
      }
    };

    fetchUser();
  }, [id, token]);

  const handleStatusChange = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { status: status === 'active' ? 'inactive' : 'active' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(res.data.user);
      setStatus(res.data.user.status);
      alert('Status updated');
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  if (!user) return <p>Loading user details...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{user.name}'s Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {status}</p>
      <button onClick={handleStatusChange}>
        Set {status === 'active' ? 'Inactive' : 'Active'}
      </button>
      <br /><br />
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default AdminUserDetail;
