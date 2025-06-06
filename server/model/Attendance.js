import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // one record per user per day
  punchCycles: [
    {
      punchIn: { type: Date, required: true },
      punchOut: { type: Date },
      compliance: {
        loginStatus: {
          type: String,
          enum: ['Early', 'On Time', 'Late'],
        },
        logoutStatus: {
          type: String,
          enum: ['Early', 'On Time', 'Late'],
        }
      }
    }
  ],
  workedHours: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
