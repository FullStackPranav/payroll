import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/EmployeeSidebar.css';

const EmployeeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className={`employee-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3>Employee Menu</h3>
        <ul>
          <li>
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
          </li>
          <li>
            <Link to="/employee/payslips" onClick={() => setIsOpen(false)}>View Payslips</Link>
          </li>
          <li>
            <Link to="/employee/leaves/me" onClick={() => setIsOpen(false)}>Leaves</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default EmployeeSidebar;
