const express = require('express');
const router = express.Router();
const { generateIdea } = require('../controllers/generateController');
const { generateImage } = require('../controllers/imageController');

router.post('/', generateIdea);
router.post('/image', generateImage);

module.exports = router;
