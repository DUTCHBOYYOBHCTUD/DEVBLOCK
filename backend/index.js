const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Aggressive CORS configuration to solve browser blocking
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  next();
});

// Backup CORS middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Import and use all routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile');
const submitRoutes = require('./routes/submit');
const voteRoutes = require('./routes/vote');
const generateRoutes = require('./routes/generate');
const topRoutes = require('./routes/top');
const promptRoutes = require('./routes/prompts');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/submit', submitRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/top', topRoutes);
app.use('/api/prompts', promptRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
