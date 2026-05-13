const axios = require('axios');
const { getSpendingSummary } = require('./analyzer');
const supabase = require('../db/db');

const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';

async function getCostDataForAgent() {
    const { data, error } = await supabase
        .from('cost_daily')
        .select('date, service, cost_amount')
        .order('date', { ascending: false })
        .limit(100);

    if (error) throw error;
    return data.map(row => ({
        date: row.date,
        service: row.service,
        cost_amount: parseFloat(row.cost_amount),
        currency: 'USD'
    }));
}

async function runAgentAnalysis(goal = null) {
    const[summary, costData] = await Promise.all([
        getSpendingSummary(),
        getCostDataForAgent()
    ]);

    const payload = {
        cost_data: costData,
        summary: {
            current_month_total: summary.current_month.total,
            previous_month_total: summary.previous_month.total,
            percentage_change: summary.percentage_change,
            avg_daily: summary.forecast.avg_daily,
            forecasted_total: summary.forecast.forecasted_month_total,
            top_spenders: summary.top_spenders
        },
        goal
    };

    const response = await axios.post(
        `${PYTHON_AGENT_URL}/agent/analyze`,
        payload,
        { timeout: 30000 }
    );

    return {
        raw_summary: summary,
        agent_analysis: response.data.data
    };
}

async function runAnomalyDetection() {
    const costData = await getCostDataForAgent();

    const response = await axios.post(
        `${PYTHON_AGENT_URL}/anomaly/detect`,
        { cost_data: costData },
        { timeout: 30000 }
    );

    return response.data.data;
}

async function runForecast(daysAhead = 30) {
    const costData = await getCostDataForAgent();

    const response = await axios.post(
        `${PYTHON_AGENT_URL}/forecast/predict`,
        { cost_data: costData, days_ahead: daysAhead },
        { timeout: 15000 }
    );

    return response.data.data;
}

module.exports = {
    runAgentAnalysis,
    runAnomalyDetection,
    runForecast
};