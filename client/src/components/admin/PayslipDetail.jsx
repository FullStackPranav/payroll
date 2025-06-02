import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PayslipDetail = () => {
  const { id, year, month } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}/payslip`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year, month }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching payslip', err);
      }
    };
    fetchPayslip();
  }, [id, year, month, token]);

  if (!data) return <p>Loading payslip...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{data.employee.name}'s Payslip for {new Date(data.year, data.month - 1).toLocaleString('default', { month: 'long' })} {data.year}</h2>
      <p><strong>Role:</strong> {data.employee.role}</p>
      <p><strong>Hourly Rate:</strong> ₹{data.employee.hourlyRate}</p>
      <p><strong>Total Hours Worked:</strong> {data.totalHours} hrs</p>
      <p><strong>Total Pay:</strong> ₹{data.totalPay}</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default PayslipDetail;
