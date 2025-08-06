// routes/adminroutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  assignJobRole,
  getAllUsers,
  getEmployeeStats,
  getUserById,
  updateUserStatus
} from '../controller/userController.js';

import {
  createEmployeeRole,
  deleteRole,
  getAllEmployeeRoles,
  
  getPayslipData,

} from '../controller/payrollcontroller.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { updateWorkedHours } from '../controller/attendanceController.js';

const router = express.Router();

router.get('/users/all', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.put('/users/:id/status', verifyToken, updateUserStatus);
router.get('/admin/totalusers',verifyToken,getEmployeeStats);






router.get('/users/:id/payslip', verifyToken, getPayslipData); 
router.get('/employee/payslip/me', verifyToken, getPayslipData);
router.patch('/attendance/:id/adjust-hours', verifyToken, updateWorkedHours);


router.post('/employee-roles', verifyToken, createEmployeeRole);
router.get('/employee-roles', verifyToken, getAllEmployeeRoles);
router.put('/users/:id/assign-job-role',verifyToken,assignJobRole);
router.delete('/employee-roles/:id',verifyToken,deleteRole)

export default router;
