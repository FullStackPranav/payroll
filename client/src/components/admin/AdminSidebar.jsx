import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate()

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
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
          transition: 'left 0.3s ease',
          height: '30px',
          width: '30px'
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3>Admin Menu</h3>
        <ul>
          <li>
            <button className='back-button' onClick={()=>navigate(-1)}>Back</button>
          </li>
          <li>
            <Link to="/adminviewusers" onClick={() => setIsOpen(false)}>View Employees</Link>
          </li>
          <li>
            <Link to="/adminviewroles" onClick={() => setIsOpen(false)}>View Roles</Link>
          </li>
          <li>
            <Link to="/adminviewshifts" onClick={() => setIsOpen(false)}>View Shifts</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
