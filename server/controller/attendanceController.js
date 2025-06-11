import Attendance from "../model/Attendance.js"

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import User from "../model/User.js";

dayjs.extend(isoWeek);


export const punchIn = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user data first
    const user = await User.findById(userId).populate("shift");

    // **Check if user is inactive**
    if (user.status !== "active") {
      return res.status(403).json({ message: "Inactive users cannot punch in" });
    }

    // Find today's attendance record or create a new one
    let record = await Attendance.findOne({
      user: userId,
      date: dayjs().startOf("day").toDate(),
    });

    if (!record) {
      record = new Attendance({
        user: userId,
        date: dayjs().startOf("day").toDate(),
        punchCycles: [],
        workedHours: 0,
      });
    }

    const openCycle = record.punchCycles.find((cycle) => !cycle.punchOut);
    if (openCycle) {
      return res.status(400).json({ message: "Already punched in, please punch out first" });
    }

    const now = new Date();
    let loginStatus = null;

    if (user && user.shift && user.shift.startTime) {
      const shiftStart = new Date();
      const [hours, minutes] = user.shift.startTime.split(":").map(Number);
      shiftStart.setHours(hours, minutes, 0, 0);

      const diffInMinutes = (now - shiftStart) / (1000 * 60);

      if (diffInMinutes < -15) {
        loginStatus = "Early";
      } else if (diffInMinutes >= -15 && diffInMinutes <= 10) {
        loginStatus = "On Time";
      } else {
        loginStatus = "Late";
      }
    }

    // Add new punch cycle with punchIn and compliance
    record.punchCycles.push({
      punchIn: now,
      compliance: {
        loginStatus,
      },
    });

    await record.save();
    res.status(200).json({ message: "Punch in recorded", loginStatus });
  } catch (err) {
    console.error("PunchIn Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const punchOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const record = await Attendance.findOne({
      user: userId,
      date: dayjs().startOf('day').toDate(),
    });

    if (!record) {
      return res.status(400).json({ message: "No attendance record for today found" });
    }

    const openCycle = record.punchCycles.find(cycle => !cycle.punchOut);
    if (!openCycle) {
      return res.status(400).json({ message: "No open punch-in found" });
    }

    const now = new Date();
    openCycle.punchOut = now;

    // Fetch user and their shift
    const user = await User.findById(userId).populate('shift');
    let logoutStatus = null;

    if (user && user.shift && user.shift.endTime) {
      const shiftEnd = new Date();
      const [hours, minutes] = user.shift.endTime.split(':').map(Number);
      shiftEnd.setHours(hours, minutes, 0, 0);

      const diffInMinutes = (now - shiftEnd) / (1000 * 60);

      if (diffInMinutes < -15) {
        logoutStatus = 'Early';
      } else if (diffInMinutes >= -15 && diffInMinutes <= 10) {
        logoutStatus = 'On Time';
      } else {
        logoutStatus = 'Late';
      }
    }

    if (!openCycle.compliance) {
      openCycle.compliance = {};
    }
    openCycle.compliance.logoutStatus = logoutStatus;

    const workedHoursForCycle = (openCycle.punchOut - openCycle.punchIn) / (1000 * 60 * 60);
    record.workedHours = (record.workedHours || 0) + workedHoursForCycle;

    await record.save();
    res.status(200).json({ message: "Punch out recorded", logoutStatus, workedHours: record.workedHours.toFixed(2) });
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
export const getMonthlyLogs = async (req, res) => {
  try {
    let userId = req.params.id;
    if (userId === 'me') {
      userId = req.user.id; // Use logged-in user ID if "me"
    }

    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month query parameters are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // end of month

    const records = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const logs = records.map(record => {
      const originalHours = record.punchCycles.reduce((sum, cycle) => {
        if (cycle.punchIn && cycle.punchOut) {
          const hours = (new Date(cycle.punchOut) - new Date(cycle.punchIn)) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);

      return {
        _id: record._id, // Needed for PATCHing
        date: record.date.toDateString(),
        punchCycles: record.punchCycles.map(cycle => ({
          punchIn: cycle.punchIn,
          punchOut: cycle.punchOut,
          loginStatus: cycle.compliance?.loginStatus || null,
          logoutStatus: cycle.compliance?.logoutStatus || null,
        })),
        originalHours: originalHours.toFixed(2),  // Calculated from punches
        workedHours: record.workedHours?.toFixed(2) || '' // Admin-set, editable field
      };
    });

    res.json(logs);
  } catch (err) {
    console.error('Monthly Log Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch monthly logs' });
  }
};


export const updateWrokedHours=async(req,res)=>{
  const{id}=req.params;
  const{workedHours}=req.body;

  if(typeof workedHours !=='number' || workedHours<0){
    return res.status(400)({message:'wokred hours must bea  non negative number'})

  }

  try{
    const attendance = await Attendance.findById(id);
    if(!attendance){
      return res.status(404).json({message:'no record found'})
    }
    attendance.workedHours=workedHours;
    await attendance.save()
    res.json({message:'worked hours updated'})
  }
  catch(err){
    console.error('Error updating hours',err)
    res.status(500).json({message:'server error while updating worked hours'})
  }
}
