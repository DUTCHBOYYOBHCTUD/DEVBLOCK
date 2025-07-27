const express = require('express');
const router = express.Router();
const { submitPrompt } = require('../controllers/submitController'); // move logic to controller

const verifyToken = require('../middleware/verifyToken'); // if you use token-based auth

// Use the token middleware if needed
router.post('/', verifyToken, submitPrompt); 

module.exports = router;
