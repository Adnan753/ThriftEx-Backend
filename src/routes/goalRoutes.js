const express = require('express');
const { setGoal, listGoals, achieveGoal } = require('../controllers/goalController');

const router = express.Router();

router.post('/', setGoal);

router.get('/', listGoals);

router.post('/:id/achieve', achieveGoal);

module.exports = router;