import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';


// REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Register endpoint hit");
    console.log("Received data:", req.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log("User saved:", newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser };
