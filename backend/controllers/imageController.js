const axios = require('axios');

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Using a free image generation API (you can replace with your preferred service)
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: "512x512"
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.data && response.data.data[0]) {
      res.json({ imageUrl: response.data.data[0].url });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }

  } catch (error) {
    console.error('❌ Image generation error:', error?.response?.data || error.message);
    
    // Fallback: return a placeholder image URL
    const placeholderUrl = `https://via.placeholder.com/512x512/8d2be2/ffffff?text=${encodeURIComponent('Generated Image')}`;
    res.json({ imageUrl: placeholderUrl });
  }
};

module.exports = { generateImage };