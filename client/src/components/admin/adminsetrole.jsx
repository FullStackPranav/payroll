import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar';
import AdminSidebar from './AdminSidebar';
import '../css/AdminRolesPage.css'; // ✅ Import the CSS file

const AdminRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = 'http://localhost:5000';

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/employee-roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(Array.isArray(res.data) ? res.data : res.data.roles || []);
    } catch (err) {
      console.error('Error fetching roles', err);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !hourlyRate) {
      setError('Both fields are required.');
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/employee-roles`,
        { name, hourlyRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      setHourlyRate('');
      setSuccess('✅ Role created successfully!');
      fetchRoles();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Error creating role');
    }
  };

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <div className="admin-roles-container">
        <div className="admin-roles-wrapper">

          <div className="form-card">
            <h2 className="form-title">➕ Add New Role</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div>
                <label className="form-label">Role Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eg: Developer"
                />
              </div>
              <div>
                <label className="form-label">Hourly Rate (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Eg: 500"
                />
              </div>
              <div className="form-action">
                <button type="submit" className="submit-button">
                  Create Role
                </button>
              </div>
            </form>
            {error && <div className="error-text">{error}</div>}
            {success && <div className="success-text">{success}</div>}
          </div>

          <div className="table-card">
            <h2 className="table-title">📋 Existing Roles</h2>
            {roles.length > 0 ? (
              <div className="table-wrapper">
                <table className="role-table">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th>Hourly Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role._id}>
                        <td>{role.name}</td>
                        <td>₹{role.hourlyRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data-text">No roles found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRolesPage;
