const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/generate', require('./routes/generate'));
app.use('/api/generate-image', require('./routes/generateImage'));
app.use('/api/submit', require('./routes/submit'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/vote', require('./routes/vote'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

