import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../navbar';

const AdminUserPayslipPage = () => {
  const { id } = useParams();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  const startYear = 2023;
  const allMonths = [];

  for (let y = startYear; y <= currentYear; y++) {
    for (let m = 0; m < 12; m++) {
      if (y === currentYear && m > currentMonth) break;
      allMonths.push({ year: y, month: m });
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar/>
      <h2>Monthly Payslip Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {allMonths.map(({ year, month }) => {
            const isPastMonth =
              year < currentYear || (year === currentYear && month < currentMonth);
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            return (
              <tr key={`${year}-${month}`}>
                <td>{monthName} {year}</td>
                <td>{isPastMonth ? 'Generated' : 'Pending'}</td>
                <td>
                  <Link to={`/admin/users/${id}/payslip/${year}/${month + 1}`}>
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserPayslipPage;
