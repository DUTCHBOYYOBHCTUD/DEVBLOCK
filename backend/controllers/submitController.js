const axios = require('axios');
const Prompt = require('../models/prompt'); // MongoDB model
const User = require('../models/User');     // ⬅️ Import user model

const submitPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.userId; // ⬅️ Extracted from token via verifyToken middleware

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 🔸 Save prompt to Prompt collection
    const newPrompt = new Prompt({ prompt });
    await newPrompt.save();

    // 🔹 Send prompt to OpenRouter AI
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // ✅ Save prompt to user's savedPrompts
    const user = await User.findById(userId);
    if (user) {
      user.savedPrompts.push(prompt);
      await user.save();
    }

    // 🟢 Return success response
    res.json({
      message: 'Prompt submitted and saved successfully',
      reply: aiReply,
      promptId: newPrompt._id,
      savedPrompts: user?.savedPrompts || []
    });

  } catch (error) {
    console.error('❌ Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'AI request or prompt save failed' });
  }
};

module.exports = { submitPrompt };
