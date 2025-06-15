import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logout from './logout';
import './css/Navbar.css';
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
    <nav className="navbar">
     
      <div className="navbar-top">
        <div className="navbar-brand">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>
          <span className="brand-text">Payroll App</span>
        </div>

        {user?.photo && (
          <img className="navbar-photo" src={`http://localhost:5000/${user.photo}`} alt="Profile" />
        )}
      </div>

      <div className={`navbar-content ${menuOpen ? 'open' : ''}`}>
        {user?.role === 'admin' && (
          <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={18} />

            <span>Admin Dashboard</span>
          </Link>
        )}

        {user?.role === 'employee' && (
          <Link to="/employee-dashboard" onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={18} />

            <span>Employee Dashboard</span>
          </Link>
        )}

        {user ? (
          <>
            <span className="navbar-welcome">Welcome, {user.name}</span>
            <button onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
            
          </>
        ) : (
          <>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <UserPlus size={18} />
              <span>Register</span>
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
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
