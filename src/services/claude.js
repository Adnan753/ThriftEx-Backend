const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL
})

async function analyzeCosts(summaryData) {
  const prompt = `You are a FinOps expert analyzing AWS cloud costs for a small business.

Here is their current AWS spending data:
- Current Month Total: $${summaryData.current_month.total}
- Previous Month Total: $${summaryData.previous_month.total}
- Month over Month Change: ${summaryData.percent_change}
- Forecasted Month Total: $${summaryData.forecast.forecasted_month_total}
- Average Daily Spend: $${summaryData.forecast.avg_daily}

Top AWS Services by Cost:
${summaryData.top_spenders.map((s, i) => `${i + 1}. ${s.service}: $${s.total}`).join("\n")}

Provide a JSON response with exactly this structure:
{
    "summary": "2-3 sentence plain English summary of their spending situation",
    "insights": [
        {
            "type": "warning/info/success",
            "title": "Short title",
            "description": "What this means for them"
        }
    ],
    "recommendations": [
        {
            "priority": "high/medium/low",
            "service": "AWS service name",
            "action": "Exactly what to do",
            "estimated_saving": "Dollar amount or percentage",
            "reasoning": "Why this will help"
        }
    ]
}

Return only valid JSON, no markdown, no extra text.`;

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0].message.content;
  return JSON.parse(text);
}

module.exports = { analyzeCosts };