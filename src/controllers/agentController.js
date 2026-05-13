const { getSpendingSummary } = require('../services/analyzer');
const { analyzeCosts } = require('../services/claude');
const { saveRecommendation, getPendingRecommendations, executeRecommendation, dismissRecommendation } = require('../services/executor');
const { runAgentAnalysis, runAnomalyDetection, runForecast } = require('../services/agentBridge');

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

async function getAgentAnalysis(req, res) {
    try {
        const { goal } = req.query;
        const result = await runAgentAnalysis(goal || null);
        
        return res.status(200).json({
            message: 'Agent analysis complete',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

async function getAnomalies(req, res) {
    try {
        const result = await runAnomalyDetection();

        return res.status(200).json({
            message: 'Anomaly detection complete',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function getForecast(req, res) {
    try {
        const days = parseInt(req.query.days) || 30;
        const result = await runForecast(days);

        return res.status(200).json({
            message: 'Forecast complete',
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
    rejectRecommendation,
    getAgentAnalysis,
    getAnomalies,
    getForecast
}