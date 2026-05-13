const express = require('express');
const { generateAndSaveRecommendations, listRecommendations, approveRecommendation, rejectRecommendation, getAgentAnalysis, getAnomalies, getForecast } = require('../controllers/agentController');

const router = express.Router();

router.post('/recommend', generateAndSaveRecommendations);

router.get('/recommendations',listRecommendations);

router.post('/recommendations/:id/approve', approveRecommendation);

router.post('/recommendations/:id/reject', rejectRecommendation);

// FASTapi Endpoints
router.get('/analyze', getAgentAnalysis);

router.get('/anomalies', getAnomalies);

router.get('/forecast', getForecast);

module.exports = router;