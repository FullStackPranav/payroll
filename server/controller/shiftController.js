import Shift from "../model/Shift.js";
import User from "../model/User.js";


export  const createShift= async(req,res)=>{
    const {name,days,startTime,endTime}=req.body;

    try{
        const shift=new Shift({name,days,startTime,endTime})
        await shift.save();
        res.status(201).json({message:'shift created',shift});
    }
    catch(error){
        console.error("error creating shift",error);
        res.status(500).json({message:'server error'})
    }
}

export const getAllShifts=async(req,res)=>{
    try{
        const shifts=await Shift.find();
        res.json(shifts)   
    }
    catch(error){
        console.error('error fetching shifts:',error)
        res.status(500).json({message:'server error'})
    }
}



export const assignShiftToUser = async (req, res) => {
  const { userId, shiftId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.shift = shiftId;
    await user.save();

    res.json({ message: "Shift assigned to user", user });
  } catch (err) {
    console.error("Error assigning shift:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteShift = async (req, res) => {
  const { shiftId } = req.params;
  try {
    const shift = await Shift.findByIdAndDelete(shiftId);
    if (!shift) return res.status(404).json({ message: "Shift not found" });

    await User.updateMany({ shift: shiftId }, { $unset: { shift: "" } });

    res.json({ message: "Shift deleted successfully", deletedShift: shift });
  } catch (error) {
    console.error("Error deleting shift:", error);
    res.status(500).json({ message: "Server error" });
  }
};
