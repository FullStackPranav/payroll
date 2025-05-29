// routes/adminroutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  getAllUsers,
  getUserById,
  updateUserStatus
} from '../controller/userController.js';

import {
  createEmployeeRole,
  getAllEmployeeRoles
} from '../controller/payrollcontroller.js';

const router = express.Router();

// USER routes (now prefixed manually)
router.get('/users/all', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.put('/users/:id/status', verifyToken, updateUserStatus);

// EMPLOYEE ROLE routes (also prefixed)
router.post('/employee-roles', verifyToken, createEmployeeRole);
router.get('/employee-roles', verifyToken, getAllEmployeeRoles);

export default router;
