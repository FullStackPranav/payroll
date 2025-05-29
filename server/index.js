import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import adminRoutes from './routes/adminroutes.js'; // Will now include both user and role routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 👇 Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', adminRoutes); // NOTE: Only this one now covers both /users and /employee-roles

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
