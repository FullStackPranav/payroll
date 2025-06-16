import Leave from "../model/Leave.js";

// Apply for leave (user auto-attached via verifyToken middleware)
export const applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      ...req.body,
      user: req.user.id, // ✅ attach user from token
      status: 'Pending'  // default status
    });
    res.status(200).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get leaves for the logged-in user
export const getUserLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ fromDate: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: 'user',
        select: 'name email jobRole',
        populate: {
          path: 'jobRole',
          select: 'name'  // we only need the name of the role
        }
      })
      .sort({ fromDate: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update leave status (approve/reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getApprovedLeavesForMonth = async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: 'Year and month required' });
  }

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59); // last day of month

  try {
    const leaves = await Leave.find({
      employee: req.user._id,
      status: 'Approved',
      $or: [
        {
          startDate: { $lte: endOfMonth },
          endDate: { $gte: startOfMonth }
        }
      ]
    });

   
    let totalLeaveDays = 0;
    leaves.forEach((leave) => {
      const from = new Date(Math.max(new Date(leave.startDate), startOfMonth));
      const to = new Date(Math.min(new Date(leave.endDate), endOfMonth));
      const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      totalLeaveDays += days;
    });

    res.json({ totalLeaveDays });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaves' });
  }
};