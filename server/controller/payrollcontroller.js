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


export const getPayslipData = async (req, res) => {
  const { id } = req.params;
  const { year, month } = req.query;

  try {
    const user = await User.findById(id).populate('jobRole');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fix template literal usage and typo in variable name
    const startOfMonth = moment.utc(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = moment.utc(startOfMonth).endOf('month').toDate();

    const logs = await Attendance.find({
      user: id,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Fix: use workedHours instead of hoursWorked and safely handle missing values
    const totalHours = logs.reduce((sum, log) => sum + (log.workedHours || 0), 0);

    const hourlyRate = user.jobRole?.hourlyRate || 0;
    const totalPay = totalHours * hourlyRate;

    res.json({
      employee: {
        name: user.name,
        role: user.jobRole?.name || 'Not Assigned',
        hourlyRate,
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

// @desc Get list of months from user join date till now
export const getPayslipMonthsForLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const startDate = moment(user.joinDate).startOf('month');
    const endDate = moment().startOf('month');

    const months = [];
    let current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
      months.push({ year: current.year(), month: current.month() + 1 }); // +1 because JS months are 0-indexed
      current.add(1, 'month');
    }

    res.json(months);
  } catch (err) {
    console.error('Error fetching payslip months:', err);
    res.status(500).json({ message: 'Server error while fetching payslip months' });
  }
};

