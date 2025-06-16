import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeSidebar from './EmployeeSidebar';
import Navbar from '../navbar';
import '../css/EmployeeLeavePage.css'; // ✅ Import external CSS

const EmployeeLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    type: 'Sick',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const token = localStorage.getItem('token');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leaves/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Leave API response:', res.data);

      const fetchedLeaves = Array.isArray(res.data) ? res.data : res.data.leaves || [];
      setLeaves(fetchedLeaves);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setLeaves([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/leaves/apply',
        { ...form },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setForm({ type: 'Sick', fromDate: '', toDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      console.error('Error applying leave:', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves = Array.isArray(leaves)
    ? leaves
        .filter((leave) => statusFilter === 'All' || leave.status === statusFilter)
        .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
    : [];

  return (
    <>
    <Navbar />
      <EmployeeSidebar />
    <div className="employee-leave-container">
      

      <h2>Apply for Leave</h2>

      <form onSubmit={handleSubmit} className="leave-form">
        <div>
          <label>Type:</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Sick">Sick</option>
            <option value="Privelage">Privelage</option>
            <option value="Maternity">Maternity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>From:</label>
          <input
            type="date"
            value={form.fromDate}
            onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label>To:</label>
          <input
            type="date"
            value={form.toDate}
            onChange={(e) => setForm({ ...form, toDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Reason:</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>

        <button type="submit">Apply</button>
      </form>

      <h3>My Leaves</h3>

      <div className="leave-filter">
        <label>Filter by status: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.type}</td>
              <td>{leave.fromDate?.split('T')[0]}</td>
              <td>{leave.toDate?.split('T')[0]}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default EmployeeLeavePage;
