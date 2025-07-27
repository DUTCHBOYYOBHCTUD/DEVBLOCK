const express = require('express');
const router = express.Router();
const { getTopResults } = require('../controllers/topController');

router.get('/', getTopResults);
module.exports = router;
