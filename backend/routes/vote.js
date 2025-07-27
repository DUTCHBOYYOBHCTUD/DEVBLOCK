const express = require('express');
const router = express.Router();
const Prompt = require('../models/prompt');

router.post('/', async (req, res) => {
  try {
    const { prompt, voteType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Valid vote type (up/down) is required' });
    }

    // Find existing prompt
    let existingPrompt = await Prompt.findOne({ prompt });
    
    if (existingPrompt) {
      // Update votes based on type
      if (voteType === 'up') {
        existingPrompt.votes += 1;
      } else if (voteType === 'down') {
        existingPrompt.votes -= 1;
      }
      await existingPrompt.save();
      res.json({ 
        message: `${voteType}vote recorded`, 
        votes: existingPrompt.votes 
      });
    } else {
      res.status(404).json({ error: 'Prompt not found' });
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

module.exports = router;
