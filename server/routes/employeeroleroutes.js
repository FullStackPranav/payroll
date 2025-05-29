// routes/employeeRoleRoutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  createEmployeeRole,
  getAllEmployeeRoles,
} from '../controller/payrollcontroller.js';

const router = express.Router();

router.post('/', verifyToken, createEmployeeRole);
router.get('/', verifyToken, getAllEmployeeRoles);

export default router;
