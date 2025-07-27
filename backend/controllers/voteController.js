const Prompt = require('../models/prompt');

const votePrompt = async (req, res) => {
  try {
    const { prompt, voteType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Valid vote type (up/down) is required' });
    }

    // Find existing prompt or create new one
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
        prompt: existingPrompt.prompt, 
        votes: existingPrompt.votes 
      });
    } else {
      // Create new prompt with initial vote
      const initialVotes = voteType === 'up' ? 1 : -1;
      const newPrompt = new Prompt({ prompt, votes: initialVotes });
      await newPrompt.save();
      res.json({ 
        message: `New prompt added with ${voteType}vote`, 
        prompt: newPrompt.prompt, 
        votes: newPrompt.votes 
      });
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
};

module.exports = { votePrompt };
