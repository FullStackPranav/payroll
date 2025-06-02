// client/src/components/employee/PayslipDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PayslipDetail = () => {
  const { year, month } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/employee/payslips`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year, month },
          });
        setPayslip(res.data);
      } catch (err) {
        console.error("Error fetching payslip detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayslip();
  }, [year, month, token]);

  if (loading) return <p>Loading payslip details...</p>;

  if (!payslip) return <p>No payslip data found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)}>Back to Payslips</button>
      <h2>Payslip for {month}/{year}</h2>
      <p><strong>Employee Name:</strong> {payslip.employee.name}</p>
      <p><strong>Role:</strong> {payslip.employee.role}</p>
      <p><strong>Hourly Rate:</strong> ${payslip.employee.hourlyRate.toFixed(2)}</p>
      <p><strong>Total Hours Worked:</strong> {payslip.totalHours}</p>
      <p><strong>Total Pay:</strong> ${payslip.totalPay.toFixed(2)}</p>
    </div>
  );
};

export default PayslipDetail;
