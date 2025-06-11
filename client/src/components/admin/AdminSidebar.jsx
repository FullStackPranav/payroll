import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '1rem',
          left: isOpen ? '200px' : '10px',
          zIndex: 1001,
          padding: '0.4rem 0.6rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'left 0.3s ease'
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3>Admin Menu</h3>
        <ul>
          <li>
            <Link to="/adminviewusers">View Employees</Link>
          </li>
          <li>
            <Link to="/adminviewroles">View Roles</Link>
          </li>
          <li>
            <Link to="/adminviewshifts">View Shifts</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
