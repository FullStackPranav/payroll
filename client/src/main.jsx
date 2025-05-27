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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/adminviewusers" element={<AdminUserList />} />

        <Route path="/admin-dashboard"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>

        <Route path="/employee-dashboard"element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>}/>
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
