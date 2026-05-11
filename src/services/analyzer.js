const supabase = require("../db/db");

function getCurrentMonthRange () {
    const now = new Date();
    const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const end = now.toISOString().split("T")[0];
    return { start, end };
}

function getPreviousMonthRange() {
    const now = new Date();
    const start = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}-01`;
    const end = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}-${new Date(now.getFullYear(), now.getMonth(), 0).getDate()}`;
    return { start, end };
}

function aggregateByService (data) {
    const totals = {};
    for (const row of data) {
        totals[row.service] = (totals[row.service] || 0) + parseFloat(row.cost_amount);
    }
    return totals;
}

async function getSpendingSummary () {
    const { start, end } = getCurrentMonthRange();
    const { start: prevStart, end: prevEnd } = getPreviousMonthRange();

    const { data: currentData, error: currentError } = await supabase
        .from('cost_daily')
        .select('service, cost_amount, date')
        .gte('date', start)
        .lt('date', end);

    if (currentError) throw currentError;

    const { data: prevData, error: prevError } = await supabase
        .from('cost_daily')
        .select('cost_amount')
        .gte('date', prevStart)
        .lte('date', prevEnd);

    if (prevError) throw prevError;
    
    const currentTotal = currentData.reduce((sum, r) => sum + parseFloat(r.cost_amount), 0);

    const prevTotal = prevData.reduce((sum, r) => sum + parseFloat(r.cost_amount), 0);

    const percentChange = prevTotal > 0
        ? (((currentTotal - prevTotal) / prevTotal) * 100).toFixed(2)
        : null;

    const byService = aggregateByService(currentData);
    const topSpenders = Object.entries(byService)
        .map(([service, total]) => ({
            service,
            total: parseFloat(total.toFixed(6))
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    const dailyTotals = {};
    for (const rows of currentData) {
        dailyTotals[rows.date] = (dailyTotals[rows.date] || 0) + parseFloat(rows.cost_amount);
    }

    const dailyValues = Object.values(dailyTotals);
    const avgDaily = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - now.getDate();
    const forecastedTotal = currentTotal + (avgDaily * remainingDays);;

    return {
        current_month: {
            total: parseFloat(currentTotal.toFixed(6)),
            from: start,
            to: end
        },
        previous_month: {
            total: parseFloat(prevTotal.toFixed(6)),
            from: prevStart,
            to: prevEnd
        },
        percent_change: percentChange ? `${percentChange}%` : 'No previous data',
        forecast: {
            avg_daily: parseFloat(avgDaily.toFixed(6)),
            remaining_days: remainingDays,
            forecasted_month_total: parseFloat(forecastedTotal.toFixed(6))
        },
        top_spenders: topSpenders

    };
}

module.exports = { getSpendingSummary };