const Prompt = require('../models/prompt');

const getTopResults = async (req, res) => {
  try {
    // Get top 10 prompts sorted by votes (descending)
    const topPrompts = await Prompt.find()
      .sort({ votes: -1 })
      .limit(10)
      .select('prompt votes');

    res.json(topPrompts);
  } catch (error) {
    console.error('❌ Error fetching top prompts:', error);
    res.status(500).json({ error: 'Failed to fetch top prompts' });
  }
};

module.exports = { getTopResults };
