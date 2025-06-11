import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/EmployeeSidebar.css';

const EmployeeSidebar = () => {
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
        {isOpen ? '☰' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3>Employee Menu</h3>
        <ul>
          <li>
            <Link to="/employee/payslips">View Payslips</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
