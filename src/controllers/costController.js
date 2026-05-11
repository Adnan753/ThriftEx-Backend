const { syncCostData } = require('../services/costExplorer');

async function fetchAndStoreCosts(req, res) {
    try {
        const rows = await syncCostData();
        return res.status(200).json({
            message: 'Cost data synced successfully',
            count: rows.length,
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

module.exports = { fetchAndStoreCosts };