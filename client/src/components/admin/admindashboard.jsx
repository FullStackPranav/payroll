import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar";
import "../css/AdminDashboard.css";
import logout from "../logout";
import Adminsidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!token) throw new Error("No authentication token found");

        const res = await axios.get("http://localhost:5000/api/admin/totalusers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data) throw new Error("Invalid response structure");

        setEmployeeStats({
          totalEmployees: res.data.totalEmployees || 0,
          activeEmployees: res.data.activeEmployees || 0,
          inactiveEmployees: res.data.inactiveEmployees || 0,
        });
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-layout">
        <Adminsidebar />
        <div className="admin-main">
          <h2 className="dashboard-heading">Welcome, Admin</h2>

          <div className="admin-info">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>

          <h3 className="section-heading">Employee Overview</h3>
          {loading ? (
            <p>Loading employee data...</p>
          ) : error ? (
            <div className="error-box">
              {error}
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <div className="stats-cards">
              <div className="stat-card-total">
                <h4>Total Employees</h4>
                <p className="stat-value">{employeeStats.totalEmployees}</p>
              </div>
              <div className="stat-card-active">
                <h4>Active Employees</h4>
                <p className="stat-value ">{employeeStats.activeEmployees}</p>
              </div>
              <div className="stat-card-inactive">
                <h4>Inactive Employees</h4>
                <p className="stat-value ">{employeeStats.inactiveEmployees}</p>
              </div>
            </div>
          )}

          <button onClick={logout} className="logout-btn">Log Out</button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
