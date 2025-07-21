
import express from 'express';
import {
  applyLeave,
  getAllLeaves,
  getApprovedLeavesForMonth,
  getUserLeaves,
  updateLeaveStatus
} from '../controller/leaveController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();


router.get('/me/approved', verifyToken, getApprovedLeavesForMonth);
router.get('/my', verifyToken, getUserLeaves);
router.get('/all', verifyToken, getAllLeaves);

router.put('/:id/status', verifyToken, updateLeaveStatus);


router.post('/apply', verifyToken, applyLeave);

export default router;
