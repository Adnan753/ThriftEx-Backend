const express = require('express');
const { getResources } = require ('../controllers/resourceController');
const router = express.Router();

router.get('/discover', getResources);

module.exports = router;