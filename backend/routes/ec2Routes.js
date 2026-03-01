const express = require("express");
const router = express.Router();
const ec2Client = require("../config/awsConfig");
const { DescribeInstancesCommand } = require("@aws-sdk/client-ec2");

router.get("/ec2", async (req, res) => {
  try {
    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);

    const instances = [];

    response.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        instances.push({
          instanceId: instance.InstanceId,
          instanceType: instance.InstanceType,
          state: instance.State.Name,
          region: process.env.AWS_REGION,
        });
      });
    });

    res.json(instances);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch EC2 instances" });
  }
});

module.exports = router;