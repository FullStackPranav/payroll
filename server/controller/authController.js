
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const photoPath = req.file ? req.file.path : ''; // image path from multer

    console.log("Register endpoint hit");
    console.log("Received data:", req.body);
    if (req.file) {
      console.log("Photo uploaded:", req.file.filename);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo: photoPath,
    });

    await newUser.save();
    console.log("User saved:", newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};





const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('shift'); // populate shift here

    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      photo: user.photo|| 'uploads/default.png',
      shift: user.shift || null, 
      status:user.status,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


export { registerUser, loginUser };
