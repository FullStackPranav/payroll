import express from 'express';
import { loginUser, registerUser } from '../controller/authController.js';
import upload from '../middleware/upload.js';

const router=express.Router();

router.post('/register',upload.single('photo'),registerUser);
router.post('/login',loginUser)

export default router;