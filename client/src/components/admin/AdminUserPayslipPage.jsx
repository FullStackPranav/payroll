import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import AdminSidebar from './AdminSidebar';

const AdminUserPayslipPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  const allMonths = [];

  // Only include 2025 months
  const targetYear = 2025;
  for (let m = 0; m < 12; m++) {
    if (targetYear === currentYear && m > currentMonth) break;
    allMonths.push({ year: targetYear, month: m });
  }

  // Reverse to show latest first
  const reversedMonths = allMonths.reverse();

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <div
        style={{
              
          paddingLeft: '200px',    
          paddingRight: '2rem',
          
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        <h2 style={{ marginBottom: '1.5rem' ,paddingTop:'55px'}}>Monthly Payslip Summary</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.2rem'
        }}>
          {reversedMonths.map(({ year, month }) => {
            const isPastMonth =
              year < currentYear || (year === currentYear && month < currentMonth);
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
                  to={`/admin/users/${id}/payslip/${year}/${month + 1}`}
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

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '2rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    </>
  );
};

export default AdminUserPayslipPage;
