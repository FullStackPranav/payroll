import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  punchIn: { type: Date, required: true },
  punchOut: { type: Date } // remove required:true
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
