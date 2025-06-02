import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './components/register';
import Login from './components/login';

;
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDashboard from './components/employee/employeedashboard';
import AdminDashboard from './components/admin/admindashboard';
import AdminUserList from './components/admin/adminviewusers';
import AdminUserDetail from './components/admin/Adminuserdetail';
import AdminRolesPage from './components/admin/adminsetrole';
import PayslipDetail from './components/admin/PayslipDetail';
import AdminUserPayslipPage from './components/admin/AdminUserPayslipPage';
import PayslipList from './components/employee/paysliplist';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

       
      {/* default */}

        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

         {/* admin */}

        <Route path="/adminviewusers" element={<AdminUserList />} />
        <Route path="/admin-dashboard"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/adminviewroles"element={<ProtectedRoute><AdminRolesPage /></ProtectedRoute>}/>
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        <Route path="/admin/users/:id/payslips" element={<AdminUserPayslipPage />} />
        <Route path="/admin/users/:id/payslip/:year/:month" element={<PayslipDetail />} />

       {/* employee */}

       <Route path="/employee-dashboard"element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>}/>
       <Route path="/employee/payslips"element={<ProtectedRoute><PayslipList /></ProtectedRoute>}/>
       <Route path="/employee/payslips/:year/:month"element={<ProtectedRoute><PayslipDetail /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
