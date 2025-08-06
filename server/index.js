import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import adminRoutes from './routes/adminroutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import leaveRoutes from './routes/Leaveroutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', adminRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/shifts', shiftRoutes);
app.use('/api/leaves',leaveRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
