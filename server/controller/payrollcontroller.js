import employeeRoleModel from "../model/employeeRoleModel.js";


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
