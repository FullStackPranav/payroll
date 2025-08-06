import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logout from './logout';
import './css/navbarloc.css';
import {
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  Menu
} from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      const photo = localStorage.getItem('photo');
      setUser({ name, role, photo });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <nav className="payroll-navbar">
      <div className="payroll-navbar-top">
        <div className="payroll-navbar-brand">
          <button className="payroll-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>
          <span className="payroll-brand-text">Payroll App</span>
        </div>

        {user?.photo && (
          <img className="payroll-navbar-photo" src={`${API_BASE_URL}/${user.photo}`} alt="Profile" />
        )}
      </div>

      <div className={`payroll-navbar-content ${menuOpen ? 'payroll-open' : ''}`}>
        {user?.role === 'admin' && (
          <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="payroll-nav-link">
            <LayoutDashboard size={18} />
            <span>Admin Dashboard</span>
          </Link>
        )}

        {user?.role === 'employee' && (
          <Link to="/employee-dashboard" onClick={() => setMenuOpen(false)} className="payroll-nav-link">
            <LayoutDashboard size={18} />
            <span>Employee Dashboard</span>
          </Link>
        )}

        {user ? (
          <>
            <span className="payroll-navbar-welcome">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="payroll-nav-button">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="payroll-nav-link">
              <UserPlus size={18} />
              <span>Register</span>
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="payroll-nav-link">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
