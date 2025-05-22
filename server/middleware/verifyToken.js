import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header Received:", authHeader); // ✅ Debug

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ NO typos
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // ✅ see this in terminal
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default verifyToken;
