import React from 'react';
import { Link } from 'react-router-dom';
import './css/Homepage.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">PayTracker</div>
        <div className="nav-links">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </nav>

      <header className="hero-section">
        <h1 className="hero-title">Track Your Work. Get Paid Right.</h1>
        <p className="hero-subtitle">Smart Payroll and Attendance Management for Modern Teams.</p>
        <div className="hero-buttons">
          <Link to="/login" className="btn-primary">Get Started</Link>
          <Link to="/register" className="btn-outline">Create Account</Link>
        </div>
      </header>

      <section className="features">
        <h2 className="section-title">Why PayTracker?</h2>
        <div className="card-container">
          <div className="feature-card">
            <h3>Punch In & Out</h3>
            <p>Track daily work hours with accurate attendance logging.</p>
          </div>
          <div className="feature-card">
            <h3>Automatic Payslips</h3>
            <p>Get monthly payslips calculated based on your work time and role.</p>
          </div>
          <div className="feature-card">
            <h3>Leave Management</h3>
            <p>Apply for leaves and view leave status in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>Enhanced security</h3>
            <p>Enhanced protection using Bcrypt and JWT authentication.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} PayTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
