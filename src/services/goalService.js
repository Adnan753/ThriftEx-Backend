const supabase = require('../db/db');
const { getSpendingSummary } = require('./analyzer');

async function createGoal(title, targetPercentage) {
    const summary = await getSpendingSummary();
    const baseline = summary.current_month.total;
    const targetAmount = baseline * (1 - targetPercentage / 100);

    const { data, error } = await supabase
        .from('goals')
        .insert({
            title,
            target_percentage: targetPercentage,
            baseline_amount: baseline,
            target_amount: parseFloat(targetAmount.toFixed(6)),
            status: 'active'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getActiveGoals() {
    const summary = await getSpendingSummary();
    const currentSpend = summary.current_month.total;

    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(goal => {
        const savedAmount = goal.baseline_amount - currentSpend;
        const progressPercent = ((savedAmount / (goal.baseline_amount - goal.target_amount)) * 100);
        const isAchieved = currentSpend <= goal.target_amount;

        return {
            ...goal,
            current_spend: currentSpend,
            saved_so_far: parseFloat(savedAmount.toFixed(6)),
            progress_percent: parseFloat(Math.min(progressPercent, 100).toFixed(2)),
            is_achieved: isAchieved,
            remaining_to_save: parseFloat(Math.max(currentSpend - goal.target_amount, 0).toFixed(6))
        };
    });
}

async function completeGoal(goalId) {
    const { data, error } = await supabase
        .from('goals')
        .update({
            status: 'achieved',
            achieved_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

module.exports = {
    createGoal,
    getActiveGoals,
    completeGoal
}