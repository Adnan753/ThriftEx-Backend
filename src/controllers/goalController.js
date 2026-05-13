const { createGoal, getActiveGoals, completeGoal } = require('../services/goalService');

async function setGoal(req, res) {
    try {
        const { title, target_percentage } = req.body;

        if (!title || !target_percentage) {
            return res.status(400).json({
                message: 'title and target_percentage are required'
            });
        }

        if (target_percentage <= 0 || target_percentage >= 100) {
            return res.status(400).json({
                message: 'target_percentage must be between 1 and 99'
            });
        }

        const goal = await createGoal(title, target_percentage);

        return res.status(201).json({
            message: 'Goal created successfully',
            data: goal
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function listGoals(req, res) {
    try {
        const goals = await getActiveGoals();

        return res.status(200).json({
            message: 'Active goals retrieved',
            count: goals.length,
            data: goals
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

async function achieveGoal(req, res) {
    try {
        const { id } = req.params;
        const goal = await completeGoal(id);

        return res.status(200).json({
            message: 'Goal marked as achieved',
            data: goal
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports = {
    setGoal,
    listGoals,
    achieveGoal
}