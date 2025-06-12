import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logout from './logout';
import './css/Navbar.css';
import {
  Home,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);

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
  <div className="navbar-content">
    {/* <Link to="/">
      <Home size={18} />
      <span>Home</span>
    </Link> */}

    {user?.role === 'admin' && (
      <Link to="/admin-dashboard">
        <LayoutDashboard size={18} />
        <span>Admin Dashboard</span>
      </Link>
    )}

    {user?.role === 'employee' && (
      <Link to="/employee-dashboard">
        <LayoutDashboard size={18} />
        <span>Employee Dashboard</span>
      </Link>
    )}

    {user ? (
      <>
        {user?.photo && (
          <img src={`http://localhost:5000/${user.photo}`} alt="Profile" />
        )}
        <span>Welcome, {user.name}</span>
        <button onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </>
    ) : (
      <>
        <Link to="/register">
          <UserPlus size={18} />
          <span>Register</span>
        </Link>
        <Link to="/login">
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
