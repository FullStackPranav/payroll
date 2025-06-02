import Attendance from "../model/Attendance.js"

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import User from "../model/User.js";

dayjs.extend(isoWeek);


export const punchIn = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find today's attendance record or create a new one
    let record = await Attendance.findOne({
      user: userId,
      date: dayjs().startOf('day').toDate(),
    });

    if (!record) {
      record = new Attendance({
        user: userId,
        date: dayjs().startOf('day').toDate(),
        punchCycles: [],
        workedHours: 0,
      });
    }

    // Check if there is already an open punch-in without punch-out
    const openCycle = record.punchCycles.find(cycle => !cycle.punchOut);
    if (openCycle) {
      return res.status(400).json({ message: "Already punched in, please punch out first" });
    }

    // Add new punch cycle with punchIn time
    record.punchCycles.push({ punchIn: new Date() });

    await record.save();
    res.status(200).json({ message: "Punch in recorded" });
  } catch (err) {
    console.error("PunchIn Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const punchOut = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find today's attendance record
    const record = await Attendance.findOne({
      user: userId,
      date: dayjs().startOf('day').toDate(),
    });

    if (!record) {
      return res.status(400).json({ message: "No attendance record for today found" });
    }

    // Find open punch cycle without punchOut
    const openCycle = record.punchCycles.find(cycle => !cycle.punchOut);
    if (!openCycle) {
      return res.status(400).json({ message: "No open punch-in found" });
    }

    // Set punchOut time
    openCycle.punchOut = new Date();

    // Calculate worked hours for this cycle in hours
    const workedHoursForCycle = (openCycle.punchOut - openCycle.punchIn) / (1000 * 60 * 60);

    // Add to total workedHours for the day
    record.workedHours = (record.workedHours || 0) + workedHoursForCycle;

    await record.save();
    res.status(200).json({ message: "Punch out recorded", workedHours: record.workedHours.toFixed(2) });
  } catch (err) {
    console.error("PunchOut Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getDailyLogs = async (req, res) => {
  try {
    // Use `id` from query if provided (admin view), otherwise default to logged-in user
    const userId = req.query.id || req.user.id;
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

    const logs = records.map(record => {
      const punchIn = record.punchCycles.length > 0 ? record.punchCycles[0].punchIn : null;
      const punchOut = record.punchCycles.length > 0 ? record.punchCycles[0].punchOut : null;
    
      if (!punchIn) {
        return {
          date: record.date.toDateString(),
          hoursWorked: 0,
          minutesWorked: 0,
        };
      }
    
      let totalMinutes = 0;
      // Sum all punch cycles durations
      record.punchCycles.forEach(cycle => {
        if (cycle.punchIn && cycle.punchOut) {
          totalMinutes += Math.round((new Date(cycle.punchOut) - new Date(cycle.punchIn)) / (1000 * 60));
        }
      });
    
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
    
      return {
        date: record.date.toDateString(),
        hoursWorked: hours,
        minutesWorked: minutes,
      };
    });
    

    res.json(logs);
  } catch (err) {
    console.error("Log Fetch Error:", err);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};
