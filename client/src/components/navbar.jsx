import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logout from './logout'; // ✅ Import your existing logout logic

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      setUser({ name, role });
    }
  }, []);

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Home</Link>

      {user?.role === 'admin' && (
        <Link to="/admin-dashboard" style={{ marginRight: '15px' }}>
          Admin Dashboard
        </Link>
      )}

      {user?.role === 'employee' && (
        <Link to="/employee-dashboard" style={{ marginRight: '15px' }}>
          Employee Dashboard
        </Link>
      )}

      {user ? (
        <>
          <span style={{ marginRight: '15px' }}>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button> {/* ✅ Uses your function */}
        </>
      ) : (
        <>
          <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
