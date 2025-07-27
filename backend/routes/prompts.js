const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Prompt schema inline if model doesn't exist
const promptSchema = new mongoose.Schema({
  prompt: { type: String, required: true, trim: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);

// GET all prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ votes: -1, createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// POST new prompt
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);
    
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const newPrompt = new Prompt({ 
      prompt: prompt.trim(),
      votes: 0 
    });
    
    const savedPrompt = await newPrompt.save();
    console.log('Saved prompt:', savedPrompt);
    
    res.json({ 
      message: 'Prompt posted successfully',
      prompt: savedPrompt 
    });
  } catch (error) {
    console.error('Error posting prompt:', error);
    res.status(500).json({ error: 'Failed to post prompt: ' + error.message });
  }
});

module.exports = router;



