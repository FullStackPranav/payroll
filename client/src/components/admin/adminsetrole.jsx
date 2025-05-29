// src/pages/AdminRolesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token'); // Adjust if stored differently
  const BASE_URL = 'http://localhost:5000';

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/employee-roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      setRoles(Array.isArray(data) ? data : data.roles || []);
    } catch (err) {
      console.error('Error fetching roles', err);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Submit new role
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
      setSuccess('Role created successfully!');
      fetchRoles();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error creating role');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Job Roles</h2>

      <ul className="mb-6">
        {Array.isArray(roles) && roles.length > 0 ? (
          roles.map((role) => (
            <li key={role._id} className="border-b py-2">
              <span className="font-semibold">{role.name}</span> - ₹{role.hourlyRate}/hr
            </li>
          ))
        ) : (
          <li className="text-gray-600">No roles found</li>
        )}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Add New Role</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Role Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hourly Rate (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Role
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
};

export default AdminRolesPage;
