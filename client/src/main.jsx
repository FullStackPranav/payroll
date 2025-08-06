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
import Employeelistpayslip from './components/employee/employeepaysliplist';
import EmployeePayslipDetail from './components/employee/payslip';
import ShiftCreate from './components/admin/ShiftCreate';
import EmployeeLeavePage from './components/employee/employeeLeave';
import AdminLeavePage from './components/admin/Adminleave';
import Home from './components/homepage';
import Navbar from './components/navbar';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>


      {/* remove
        */}
        <Route path="/nav" element={<Navbar />} />
      

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

         {/* admin */}
        <Route path="/home" element={<Home />} />    
        <Route path="/adminviewusers" element={<AdminUserList />} />
        <Route path="/admin-dashboard"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/adminviewroles"element={<ProtectedRoute><AdminRolesPage /></ProtectedRoute>}/>
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        <Route path="/admin/users/:id/payslips" element={<AdminUserPayslipPage />} />
        <Route path="/admin/users/:id/payslip/:year/:month" element={<PayslipDetail />} />
         <Route path="/adminviewshifts" element={<ShiftCreate />} />
          <Route path="/adminviewleaves" element={<AdminLeavePage />} />


       {/* employee */}

        <Route path="/employee-dashboard"element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>}/>
        <Route path="/employee/payslips"element={<ProtectedRoute><Employeelistpayslip /></ProtectedRoute>}/>
        <Route path="/employee/payslip/me"element={<ProtectedRoute><EmployeePayslipDetail /></ProtectedRoute>}/>
        <Route path="/employee/leaves/me"element={<ProtectedRoute><EmployeeLeavePage /></ProtectedRoute>}/>


      </Routes>
    </BrowserRouter>
  </StrictMode>
);
