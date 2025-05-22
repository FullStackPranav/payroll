import Attendance from "../model/Attendance.js"
export const punchIn = async (req, res) => {
    try {
      console.log("User in punchIn:", req.user);
  
      const existing = await Attendance.findOne({
        user: req.user.id,
        punchOut: { $exists: false }
      });
  
      if (existing) {
        return res.status(400).json({ message: "Already punched in" });
      }
  
      const record = new Attendance({
        user: req.user.id,
        punchIn: new Date()
      });
  
      await record.save();
      res.status(200).json({ message: "Punch in recorded" });
  
    } catch (err) {
      console.error("PunchIn Error:", err);
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
  
      record.punchOut = new Date();
      await record.save();
      res.status(200).json({ message: "Punch out recorded" });
  
    } catch (err) {
      console.error("PunchOut Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  