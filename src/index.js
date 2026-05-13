const express = require("express");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = require('./db/db');

// Importing Routes
const costRoutes = require("./routes/costRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const agentRoutes = require("./routes/agentRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const goalRoutes = require("./routes/goalRoutes");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/costs", costRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/goals", goalRoutes);

// Health & DB Check 
app.get("/", (req, res) => {
  return res.status(200).json({
    message: 'ThriftEx API is running',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
