import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/EmployeeSidebar.css';

const EmployeeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate()

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
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

      <div className={`employee-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3>Employee Menu</h3>
        <ul>
          <li>
            <button className='back-button' onClick={() => navigate(-1)}>Back</button>
          </li>
          <li>
            <Link to="/employee/payslips" onClick={() => setIsOpen(false)}>View Payslips</Link>
          </li>
          <li>
            <Link to='/employee/leaves/me' onClick={()=>setIsOpen(false)}>Leaves</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default EmployeeSidebar;
