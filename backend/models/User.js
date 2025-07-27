const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // Hide password by default
  },
  savedPrompts: [
    {
      type: String
    }
  ],
  walletCoins: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);
