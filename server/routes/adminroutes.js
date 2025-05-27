import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getAllUsers, getUserById, updateUserStatus } from '../controller/userController.js';


const router=express.Router();

router.get('/all',verifyToken,getAllUsers);
router.get('/:id',verifyToken,getUserById)
router.put('/:id/status',verifyToken,updateUserStatus);

export default router;