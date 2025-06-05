import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Morning Shift"
  days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true },   // "18:00"
});

const Shift = mongoose.model('Shift', shiftSchema);
export default Shift;
