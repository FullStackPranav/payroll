import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../navbar";
import AdminSidebar from "./AdminSidebar";
import "../css/AdminLeavePage.css";

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaves/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (err) {
        console.error("Error fetching leave data:", err);
      }
    };

    fetchLeaves();
  }, [token]);

  useEffect(() => {
    filterLeaves();
  }, [leaves, statusFilter, monthFilter, yearFilter]);

  const filterLeaves = () => {
    let filtered = [...leaves];

    if (statusFilter !== "All") {
      filtered = filtered.filter((leave) => leave.status === statusFilter);
    }

    if (monthFilter !== "All" && yearFilter !== "All") {
      filtered = filtered.filter((leave) => {
        const date = new Date(leave.fromDate);
        return (
          date.getMonth() + 1 === parseInt(monthFilter) &&
          date.getFullYear() === parseInt(yearFilter)
        );
      });
    }

    setFilteredLeaves(filtered);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/leaves/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data;
      const updatedLeaves = leaves.map((leave) =>
        leave._id === id ? updated : leave
      );
      setLeaves(updatedLeaves);
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Role",
      "From",
      "To",
      "Reason",
      "Status",
    ];
    const rows = filteredLeaves.map((leave) => [
      leave.user.name,
      leave.user.email,
      leave.user.jobRole?.name,
      new Date(leave.fromDate).toLocaleDateString(),
      new Date(leave.toDate).toLocaleDateString(),
      leave.reason,
      leave.status,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const fileName = `leaves_${monthFilter}_${yearFilter}.csv`;
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); 
  return (
    <>
      <Navbar />
      <div className="admin-dashboard-layout">
        <AdminSidebar />
        <div className="admin-main">
          <h2 className="page-title">Leave Management</h2>

          <div className="filter-section">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label>Month:</label>
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="All">All</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <label>Year:</label>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="All">All</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button className="csv-download-btn" onClick={handleDownloadCSV}>
              Download CSV
            </button>
          </div>

          <table className="leave-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Role</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.user.name}</td>
                  <td>{leave.user.email}</td>
                  <td>{leave.user.jobRole?.name}</td>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td className={`status ${leave.status.toLowerCase()}`}>{leave.status}</td>
                  <td>
                    {leave.status === "Pending" ? (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleStatusUpdate(leave._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleStatusUpdate(leave._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="no-action">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminLeavePage;
