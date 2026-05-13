const { discoverAllResources } = require('../services/resourceDiscovery');

async function getResources(req, res) {
    try {
        const resources = await discoverAllResources();
        return res.status(200).json({
            message: 'Resources discovered successfully',
            data: resources
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports = { getResources };