import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },   
});

const Shift = mongoose.model('Shift', shiftSchema);
export default Shift;
