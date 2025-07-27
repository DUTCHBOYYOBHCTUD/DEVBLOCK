const axios = require('axios');

const generateIdea = async (req, res) => {
  try {
    const { idea } = req.body; // 👈 get user's idea from the POST body
    const systemPrompt = "You're a creative AI that helps users brainstorm fun and imaginative prompts.";

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: idea || "Give me one fun creative prompt." }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiGeneratedPrompt = response.data.choices[0].message.content;
    res.json({ idea: aiGeneratedPrompt });

  } catch (error) {
    console.error('❌ Generate error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Could not generate idea' });
  }
};

module.exports = { generateIdea };
