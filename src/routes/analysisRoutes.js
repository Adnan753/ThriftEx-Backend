const express = require('express');

const { getAnalysis } = require('../controllers/analysisController');
const { getAIAnalysis } = require('../controllers/analysisController');

const router = express.Router();

router.get('/summary', getAnalysis);

router.get('/ai', getAIAnalysis);

module.exports = router;
