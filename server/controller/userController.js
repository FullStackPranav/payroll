import User from "../model/User.js";

export const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find({role:'employee'}).select('-password')
        .populate('jobRole', 'name hourlyRate');
        
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({messsage:'server error while fetching users'});
    }
}

export const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({role:'employee'});
    const activeEmployees = await User.countDocuments({ status: 'active',role:'employee' });
    const inactiveEmployees = await User.countDocuments({ status: 'inactive',role:'employee' });
    console.log(activeEmployees,inactiveEmployees,totalEmployees);

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
    });
  } catch (err) {
    console.error("Error fetching employee stats:", err); 
    // res.status(500).json({ message: "Server error"})
  }
};

export const getUserById= async(req,res)=>{
    try{
        const user =await User.findById(req.params.id)
        .select('-password')
        .populate('jobRole', 'name hourlyRate')
        .populate('shift','name');
        if(!user)return res.status(404).json({message:'user not found'});
        res.json(user);
    }catch(err){
        res.status(500).json({message:'server error'});
    }
};


export const updateUserStatus=async(req,res)=>{
    try{
        const {status}=req.body;
        const user= await User.findById(req.params.id);
        if(!user)return res.status(404).json({message:'user not found'});
            user.status=status;
            await user.save();
            res.json({message:'user status updated',user});
        }
        catch(err){
            res.status(500).json({message:'server error'});
        }
}

export const assignJobRole=async(req,res)=>{
    try{
        const{id}=req.params;
        const{jobRoleId}=req.body;

        const user=await User.findById(id);
        if(!user)return res.status(404).json({error:'user not found'});

        user.jobRole=jobRoleId;
        await user.save();

        res.json({message:'job role assigned succesfully',user});
    }
    catch(error){
        console.eroor('error while creating job role',error);
        res.status(500).json({error:'server error'});
    }
}