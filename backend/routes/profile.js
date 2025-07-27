const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

// ✅ GET /api/profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      avatar: user.avatar,
      savedPrompts: user.savedPrompts,
      walletCoins: user.walletCoins
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/profile/save-prompt
router.post('/save-prompt', verifyToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedPrompts.push(prompt);
    await user.save();

    res.json({
      message: 'Prompt saved successfully',
      savedPrompts: user.savedPrompts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
