import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmployeePayslipDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');
  const month = queryParams.get('month');

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayslip = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/employee/payslip/me', {
          headers: { Authorization: `Bearer ${token}` },
          params: { year, month }
        });
        setPayslip(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching payslip');
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchPayslip();
    } else {
      setLoading(false);
      setError('Year and month must be specified.');
    }
  }, [year, month]);

  if (loading) return <p>Loading payslip...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Payslip for {month}/{year}</h2>
      <p><strong>Name:</strong> {payslip.employee.name}</p>
      <p><strong>Role:</strong> {payslip.employee.role}</p>
      <p><strong>Hourly Rate:</strong> ₹{payslip.employee.hourlyRate}</p>
      <p><strong>Total Hours Worked:</strong> {payslip.totalHours.toFixed(2)} hrs</p>
      <p><strong>Total Pay:</strong> ₹{payslip.totalPay.toFixed(2)}</p>
    </div>
  );
};

export default EmployeePayslipDetail;
