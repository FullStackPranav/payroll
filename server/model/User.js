import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },

  jobRole: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployeeRole',
    default: null,
  },
  photo:{
    type:String,
    default:'',
  },
  shift:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Shift',
    default:null,

  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);
