import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../navbar';
import EmployeeSidebar from './EmployeeSidebar';

const Employeelistpayslip = () => {
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

  // Reverse to show latest month first
  const reversedMonths = allMonths.reverse();

  return (
    <>
    <Navbar />
      <EmployeeSidebar/>
    <div style={{  paddingTop:'100px' , padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      <h2 style={{ marginBottom: '1.5rem' }}>Monthly Payslip Summary</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.2rem'
      }}>
        {reversedMonths.map(({ year, month }) => {
          const isPastMonth = year < currentYear || (year === currentYear && month < currentMonth);
          const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
          const status = isPastMonth ? 'Generated' : 'Pending';

          return (
            <div key={`${year}-${month}`}
              style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>{monthName} {year}</h4>
                <p style={{ marginBottom: '1rem', color: isPastMonth ? 'green' : 'orange' }}>
                  Status: <strong>{status}</strong>
                </p>
              </div>
              <Link
                to={`/employee/payslip/me?year=${year}&month=${month + 1}`}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '0.5rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
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
