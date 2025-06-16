import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../navbar';
import EmployeeSidebar from './EmployeeSidebar';
import '../css/Employeelistpayslip.css';

const Employeelistpayslip = () => {
  const { id } = useParams();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); 
  const startYear = 2025;

  const allMonths = [];
  for (let y = startYear; y <= currentYear; y++) {
    for (let m = 0; m < 12; m++) {
      if (y === currentYear && m > currentMonth) break;
      allMonths.push({ year: y, month: m });
    }
  }

  const reversedMonths = allMonths.reverse();

  return (
    <>
      <Navbar />
      <EmployeeSidebar />
      <div className="payslip-list-container">
        <h2 className="payslip-list-header">Monthly Payslip Summary</h2>
        <div className="payslip-grid">
          {reversedMonths.map(({ year, month }) => {
            const isPastMonth = year < currentYear || (year === currentYear && month < currentMonth);
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            const status = isPastMonth ? 'Generated' : 'Pending';

            return (
              <div key={`${year}-${month}`} className="payslip-card">
                <div>
                  <h4>{monthName} {year}</h4>
                  <p className={`payslip-status ${isPastMonth ? 'generated' : 'pending'}`}>
                    Status: <strong>{status}</strong>
                  </p>
                </div>
                <Link
                  to={`/employee/payslip/me?year=${year}&month=${month + 1}`}
                  className="view-button"
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Employeelistpayslip;
