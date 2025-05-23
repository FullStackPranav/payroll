import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';


dotenv.config();

const app=express()
const PORT=process.env.PORT||5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance',attendanceRoutes)


connectDB();

app.listen(PORT,()=>{
    console.log('server running on port $[PORT}')
});
    