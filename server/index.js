import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import adminRoutes from './routes/adminroutes.js'; // ✅ Add this near the top



dotenv.config();

const app=express()
const PORT=process.env.PORT||5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance',attendanceRoutes)
app.use('/api/users', adminRoutes); 




connectDB();

app.listen(PORT,()=>{
    console.log('server running on port $[PORT}')
});
    