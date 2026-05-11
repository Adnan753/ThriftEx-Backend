const express = require("express");
const { fetchDailyCosts } = require("../services/costExplorer");
const { fetchAndStoreCosts } = require('../controllers/costController');
const { getFullAnalysis } = require("../services/analyzer");

const router = express.Router();

// router.get("/fetch", fetchDailyCosts);

router.get('/fetch', fetchAndStoreCosts);


router.get("/analysis", async (req, res) => {
    try {
        const analysis = await getFullAnalysis();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

module.exports = router;