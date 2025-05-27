import express from 'express';
import { getDailyLogs, punchIn, punchOut } from '../controller/attendanceController.js';
import verifyToken from '../middleware/verifyToken.js';


const router=express.Router();


router.post('/punchin',verifyToken,punchIn);
router.post('/punchout',verifyToken,punchOut);

router.get('/logs',verifyToken,getDailyLogs);

export default router;