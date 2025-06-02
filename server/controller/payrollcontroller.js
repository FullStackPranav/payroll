import Attendance from "../model/Attendance.js";
import employeeRoleModel from "../model/employeeRoleModel.js";
import User from "../model/User.js";
import moment from 'moment';




// @desc    Create a new role
export const createEmployeeRole = async (req, res) => {
  const { name, hourlyRate } = req.body;

  try {
    const existing = await employeeRoleModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Role already exists' });
    }

    const newRole = new employeeRoleModel({ name, hourlyRate });
    await newRole.save();

    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: 'Server error while creating role' });
  }
};

// @desc    Get all roles
export const getAllEmployeeRoles = async (req, res) => {
  try {
    const roles = await employeeRoleModel.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching roles' });
  }
};


export const getPayslipData=async(req,res)=>{
  const{id}=req.params;
  const{year,month}=req.query;

  try{
    const user=await User.findById(id).populate('jobRole');
    if(!user) return res.status(404).json({message:'user not found'});

    const startOfMonnth=moment.utc('${year}-${month}-01').startOf('month').toDate();
    const endOfMonth=moment.utc(startOfMonnth).endOf('month').toDate();

    const logs=await Attendance.find({
      user:id,
      date:{
        $gte:startOfMonnth,
        $lte:endOfMonth
      }
    });

    const totalHours=logs.reduce((sum,log)=>sum+log.hoursWorked,0);
    const hourlyRate=user.jobRole?.hourlyRate||0;
    const totalPay=totalHours*hourlyRate;

    res.json({
      employee:{
        name:user.name,
        role:user.jobRole?.name||'Not Assigned',
        hourlyRate,
      },
      month,
      year,
      totalHours,
      totalPay
    });

  }

  catch(err){
    console.error('Error generating payslip:',err);
    res.status(500).json({message:'Server error while generating payslip'});

  }
};
