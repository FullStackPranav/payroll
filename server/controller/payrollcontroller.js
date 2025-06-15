import Attendance from "../model/Attendance.js";
import employeeRoleModel from "../model/employeeRoleModel.js";
import User from "../model/User.js";
import moment from 'moment';





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

export const deleteRole=async(req,res)=>{
  const{id}=req.params;
  try{
    const deleted=await employeeRoleModel.findByIdAndDelete(id);
    if(!deleted){
      return res.status(404).json({message:'role not found'})
    }
    res.status(200).json({message:'role deleted succesfully'})

  }catch(err){
    console.error('error delteding role',err);
    res.status(500).json({error:'server erroer'})
  }
}

export const getAllEmployeeRoles = async (req, res) => {
  try {
    const roles = await employeeRoleModel.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching roles' });
  }
};


export const getPayslipData = async (req, res) => {
  const userId = req.params.id || req.user.id;
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: "Year and month are required" });
  }

  try {
    const user = await User.findById(userId).populate('jobRole').populate('shift');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const startOfMonth = moment.utc(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = moment.utc(startOfMonth).endOf('month').toDate();

    const logs = await Attendance.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalHours = logs.reduce((sum, log) => {
      const cycleHours = log.punchCycles?.reduce((cycleSum, cycle) => {
        if (cycle.punchIn && cycle.punchOut) {
          const inTime = new Date(cycle.punchIn);
          const outTime = new Date(cycle.punchOut);
          return cycleSum + (outTime - inTime) / (1000 * 60 * 60); // ms to hrs
        }
        return cycleSum;
      }, 0);
      return sum + cycleHours;
    }, 0);

    const hourlyRate = user.jobRole?.hourlyRate || 0;
    const totalPay = totalHours * hourlyRate;
    const shift = user.shift?.name;

    res.json({
      employee: {
        name: user.name,
        role: user.jobRole?.name || 'Not Assigned',
        hourlyRate,
        shift,
      },
      month,
      year,
      totalHours,
      totalPay
    });

  } catch (err) {
    console.error('Error generating payslip:', err);
    res.status(500).json({ message: 'Server error while generating payslip' });
  }
};






