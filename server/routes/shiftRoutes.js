import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import { assignShiftToUser, createShift, getAllShifts } from '../controller/shiftController.js'



const router=express.Router()

router.post('/Shifts',verifyToken,createShift)
router.get('/shifts',verifyToken,getAllShifts)



router.post("/assign-shift", verifyToken, assignShiftToUser);


export default router;