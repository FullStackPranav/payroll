import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            PayManager
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/features">
                  Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-light ms-3">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-light text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Simplify Your Payroll</h1>
          <p className="lead mb-4">
            Automate salaries, manage employees, and generate payslips with ease.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Core Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill fs-2 text-primary mb-3"></i>
                  <h5 className="card-title">Employee Management</h5>
                  <p className="card-text">
                    Easily add, edit, and view employee details in one place.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-cash-stack fs-2 text-success mb-3"></i>
                  <h5 className="card-title">Salary Automation</h5>
                  <p className="card-text">
                    Automatically calculate salaries with tax and deductions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-lock-fill fs-2 text-danger mb-3"></i>
                  <h5 className="card-title">Secure Access</h5>
                  <p className="card-text">
                    Role-based login system for admins and employees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h3 className="fw-bold mb-3">Start Managing Your Payroll Today</h3>
          <p className="mb-4">Join us and bring automation to your HR process.</p>
          <Link to="/signup" className="btn btn-light btn-lg">
            Sign Up
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
