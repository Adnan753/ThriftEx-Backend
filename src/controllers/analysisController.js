const { getSpendingSummary } = require('../services/analyzer');
const { analyzeCosts } = require('../services/claude');

async function getAnalysis (req, res) {
    try {
        const summary = await getSpendingSummary();
        return res.status(200).json({
            message: 'Analysis retrieved successfully',
            data: summary
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function getAIAnalysis (req, res) {
    try  {
        const summary = await getSpendingSummary();
        const aiInsights = await analyzeCosts(summary);
        return res.status(200).json({
            message: 'AI Analysis retrieved successfully',
            data: {
                raw: summary,
                ai: aiInsights
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports = { getAnalysis, getAIAnalysis };