const { EC2Client } = require("@aws-sdk/client-ec2");
require("dotenv").config();

const ec2Client = new EC2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = ec2Client;