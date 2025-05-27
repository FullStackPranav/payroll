import Attendance from "../model/Attendance.js"

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import User from "../model/User.js";

dayjs.extend(isoWeek);


export const punchIn = async (req, res) => {
  try {
    console.log("@user in punchIn", req.user);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "User is not active and cannot punch in" });
    }

    const existing = await Attendance.findOne({
      user: req.user.id,
      punchOut: { $exists: false }
    });

    if (existing) {
      return res.status(400).json({ message: "Already punched in" });
    }

    const record = new Attendance({
      user: req.user.id,
      punchIn: new Date(),
      date: new Date()
    });

    await record.save();
    res.status(200).json({ message: "Punch in recorded" });

  } catch (err) {
    console.error("Punch in error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const punchOut = async (req, res) => {
  try {
    console.log("User in punchOut:", req.user);

    const record = await Attendance.findOne({
      user: req.user.id,
      punchOut: { $exists: false }
    });

    if (!record) {
      return res.status(400).json({ message: "No punch-in record found" });
    }

    const punchOutTime = new Date();
    const workedHours = (punchOutTime - record.punchIn) / (1000 * 60 * 60); // ✅ NEW: calculate worked hours

    record.punchOut = punchOutTime;
    record.workedHours = workedHours; // ✅ NEW: store worked hours

    await record.save();
    res.status(200).json({ message: "Punch out recorded", workedHours: workedHours.toFixed(2) }); // ✅ Optional: send worked hours back

  } catch (err) {
    console.error("PunchOut Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDailyLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { week, year } = req.query;

    let startDate, endDate;

    if (week && year) {
      // If week and year are provided, calculate the date range
      startDate = dayjs().isoWeek(Number(week)).year(Number(year)).startOf('isoWeek').toDate();
      endDate = dayjs().isoWeek(Number(week)).year(Number(year)).endOf('isoWeek').toDate();
    } else {
      // Default: last 7 days
      endDate = new Date();
      startDate = dayjs(endDate).subtract(7, 'day').toDate();
    }

    const records = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    const logs = records.map((record) => {
      const punchIn = new Date(record.punchIn);
      const punchOut = new Date(record.punchOut);
      const durationHours = record.punchOut
        ? Math.round((punchOut - punchIn) / (1000 * 60 * 60) * 100) / 100
        : 0;

      return {
        date: punchIn.toDateString(),
        hoursWorked: durationHours,
      };
    });

    res.json(logs);
  } catch (err) {
    console.error("Log Fetch Error:", err);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};

