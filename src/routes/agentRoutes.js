const express = require('express');
const { generateAndSaveRecommendations, listRecommendations, approveRecommendation, rejectRecommendation } = require('../controllers/agentController');

const router = express.Router();

router.post('/recommend', generateAndSaveRecommendations);

router.get('/recommendations',listRecommendations);

router.post('/recommendations/:id/approve', approveRecommendation);

router.post('/recommendations/:id/reject', rejectRecommendation);

module.exports = router;