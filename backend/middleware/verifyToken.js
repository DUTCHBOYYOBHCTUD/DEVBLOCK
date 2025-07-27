const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure required fields exist in the token
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: 'Invalid token payload' });
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username || null  // optional: include username if token has it
    };

    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
