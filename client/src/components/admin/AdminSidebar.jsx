import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      
      <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3>Admin Menu</h3>
        <ul>
          <li>
            <button className="back-button" onClick={() => navigate(-1)}>
              Back
            </button>
          </li>
          <li>
            <Link to="/adminviewusers" onClick={() => setIsOpen(false)}>
              Manage Employees
            </Link>
          </li>
          <li>
            <Link to="/adminviewroles" onClick={() => setIsOpen(false)}>
              Manage Roles
            </Link>
          </li>
          <li>
            <Link to="/adminviewshifts" onClick={() => setIsOpen(false)}>
              Manage Shifts
            </Link>
          </li>
          <li>
            <Link to="/adminviewleaves" onClick={() => setIsOpen(false)}>
              Manage Leaves
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
