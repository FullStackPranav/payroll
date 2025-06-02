// client/src/components/employee/PayslipList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayslipList = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employee/payslips', {
            headers: { Authorization: `Bearer ${token}` },
          });
        setPayslips(res.data);
      } catch (err) {
        console.error("Error fetching payslips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayslips();
  }, [token]);

  // Helper function to determine status (assuming current month or future is pending)
  const getStatus = (year, month) => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // JS months 0-indexed
    if (year < thisYear) return 'Generated';
    if (year === thisYear && month < thisMonth) return 'Generated';
    return 'Pending';
  };

  if (loading) return <p>Loading payslips...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Payslips</h2>
      <table style={{ border: "1px solid black", borderCollapse: "collapse", width: '50%' }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Year</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Month</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payslips.map(({ year, month }, idx) => {
            const status = getStatus(year, month);
            return (
              <tr 
                key={idx} 
                style={{ cursor: status === 'Generated' ? 'pointer' : 'default', backgroundColor: status === 'Generated' ? '#d4edda' : '#f8d7da' }}
                onClick={() => {
                  if (status === 'Generated') {
                    navigate(`/employee/payslips/${year}/${month}`);
                  }
                }}
              >
                <td style={{ border: "1px solid black", padding: "8px" }}>{year}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{month}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PayslipList;
