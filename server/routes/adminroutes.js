// routes/adminroutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  assignJobRole,
  getAllUsers,
  getUserById,
  updateUserStatus
} from '../controller/userController.js';

import {
  createEmployeeRole,
  getAllEmployeeRoles,
  getPayslipData,
 
  getPayslipMonthsForLoggedInUser
} from '../controller/payrollcontroller.js';

const router = express.Router();

// USER routes 
router.get('/users/all', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.put('/users/:id/status', verifyToken, updateUserStatus);






// Payroll
router.get('/users/:id/payslip',verifyToken,getPayslipData);
router.get('/employee/payslips',verifyToken,getPayslipMonthsForLoggedInUser)

// roles
router.post('/employee-roles', verifyToken, createEmployeeRole);
router.get('/employee-roles', verifyToken, getAllEmployeeRoles);
router.put('/users/:id/assign-job-role',verifyToken,assignJobRole);


export default router;
