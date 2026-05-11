const { CostExplorerClient, GetCostAndUsageCommand } = require("@aws-sdk/client-cost-explorer");
const supabase = require("../db/db");

const client = new CostExplorerClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Fetch, normalize, store
async function syncCostData() {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];

  const startDateObj = new Date();
  startDateObj.setDate(today.getDate() - 30); // 30 days for better analysis
  const startDate = startDateObj.toISOString().split("T")[0];

  const command = new GetCostAndUsageCommand({
    TimePeriod: { Start: startDate, End: endDate },
    Granularity: "DAILY",
    Metrics: ["UnblendedCost"],
    GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }],
  });

  const response = await client.send(command);

  // Normalize into flat rows
  const rows = [];
  for (const result of response.ResultsByTime) {
    const date = result.TimePeriod.Start;
    for (const group of result.Groups) {
      const service = group.Keys[0];
      const cost = parseFloat(group.Metrics.UnblendedCost.Amount);
      if (cost > 0) {
        rows.push({ date, service, cost_amount: cost, currency: "USD" });
      }
    }
  }

  // Upsert into Supabase (no duplicates)
  const { error } = await supabase
    .from("cost_daily")
    .upsert(rows, { onConflict: "date,service" });

  if (error) throw error;

  return rows;
}

module.exports = { syncCostData };