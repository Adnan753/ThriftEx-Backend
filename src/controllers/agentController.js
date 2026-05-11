const { getSpendingSummary } = require('../services/analyzer');
const { analyzeCosts } = require('../services/claude');
const { saveRecommendation, getPendingRecommendations, executeRecommendation, dismissRecommendation } = require('../services/executor');

async function generateAndSaveRecommendations (req, res) {
    try {
        const summary = await getSpendingSummary();
        const aiInsights = await analyzeCosts(summary);

        const saved = [];
        for (const rec of aiInsights.recommendations) {
            const savedRec = await saveRecommendation(rec);
            saved.push(savedRec);
        }

        return res.status(201).json({
            message: 'Recommendations generated and saved',
            count: saved.length,
            summary: aiInsights.summary,
            insights: aiInsights.insights,
            recommendations: saved
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function listRecommendations (req, res) {
    try {
        const recommendations = await getPendingRecommendations();
        
        return res.status(200).json({
            message: 'Pending recommendations',
            count: recommendations.length,
            data: recommendations
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function approveRecommendation (req, res) {
    try {
        const { id } = req.params;
        const result = await executeRecommendation(id);

        return res.status(200).json({
            message: 'Recommendation approved and executed',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function rejectRecommendation (req, res) {
    try {
        const { id } = req.params;
        const result = await dismissRecommendation(id);

        return res.status(200).json({
            message: 'Recommendation dismissed',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports = {
    generateAndSaveRecommendations,
    listRecommendations,
    approveRecommendation,
    rejectRecommendation
}