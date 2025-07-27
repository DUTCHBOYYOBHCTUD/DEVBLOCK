const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a user
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login a user
const login = async (req, res) => {
  console.log("🔥 LOGIN ENDPOINT HIT!");
  console.log("📝 Request body:", req.body);
  console.log("📋 Request headers:", req.headers);
  
  const { username, password } = req.body;

  try {
    console.log("👉 Login attempt:", { username, password });

    // Make sure to select password field explicitly
    const user = await User.findOne({ username }).select('+password');
    console.log("🔍 User found:", user ? { id: user._id, username: user.username } : null);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, username: user.username });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

module.exports = { register, login };
