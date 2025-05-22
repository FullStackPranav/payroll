import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Register endpoint hit");
    console.log("Received data:", req.body);

    // ❌ Incorrect method: should be findOne, not findone
    const userExists = await User.findOne({ email }); 
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: 'Email already exists' });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // ❌ Typo: "passowrd" should be "password"
    const newUser = new User({ name, email, password: hashedPassword });

    // ❌ Wrong method: use save() not bulkSave()
    await newUser.save();

    console.log("User saved:", newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);  // Shows the real cause in terminal
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser=async(req,res)=>{
    const{email,password}=req.body;

    try{
        
        const user=await User.findOne({email});
        if(!user)return res.status(400).json({messsage:'invalid username or pass'});

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)return res.status(400).json({message:'invalid password or username'});

        const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token,role:user.role,name:user.name});
    }catch(err){
        res.status(500).json({message:'server error'});
    }
};

export { registerUser,loginUser };
