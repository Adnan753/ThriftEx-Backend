# ThriftEx-Backend

# CloudSage
Backend Development

# CloudSage – Cloud Cost Optimization & Resource Monitoring Platform

CloudSage is a cloud analytics system that integrates with AWS to monitor resources, analyze costs, and provide optimization recommendations.

## Technology Stack

* Node.js
* Express.js
* PostgreSQL
* AWS SDK
* Postman
* GitHub

## Backend Architecture

AWS → Backend APIs → PostgreSQL Database → Analytics APIs → Dashboard

---


# API Documentation

## Authentication APIs

### Register User

POST /api/auth/register

Create a new user account.

Example Request

```
{
  "name": "Nikhil",
  "email": "nikhil@example.com",
  "password": "password123"
}
```

---

### Login User

POST /api/auth/login

Authenticate user and return JWT token.

Example Response

```
{
  "token": "JWT_TOKEN"
}
```

---

### Protected Route

GET /api/protected

Requires Authorization header

```
Authorization: Bearer <JWT_TOKEN>
```

---

# EC2 APIs

### Fetch EC2 Instances

GET /api/aws/ec2

Fetch EC2 instances from AWS and store snapshot in database.

---

### Get EC2 Instances From Database

GET /api/aws/ec2/db

Return stored EC2 snapshot data.

---

### EC2 State Distribution

GET /api/aws/ec2/state-distribution

Return number of running vs stopped instances.

---

### EC2 Type Distribution

GET /api/aws/ec2/type-distribution

Return instance count grouped by instance type.

---

### Instance Details

GET /api/aws/ec2/:instance_id

Return detailed EC2 instance information.

---

### Idle Instance Detection (Basic)

GET /api/aws/idle-instances

Detect stopped EC2 instances stored in database.

---

### Smart Idle Detection (CloudWatch)

GET /api/aws/smart-idle-instances/:instanceId

Detect idle EC2 instances based on CPU utilization.

Logic used:

CPU Utilization < 5%

---

### EC2 Metrics (CloudWatch)

GET /api/aws/ec2-metrics/:instanceId

Fetch CPU utilization metrics from AWS CloudWatch.

---

### EC2 Optimization Recommendations

GET /api/aws/recommendations

Generate infrastructure optimization suggestions.

---

# EBS APIs

### Fetch EBS Volumes

GET /api/aws/ebs

Retrieve EBS volume data from AWS.

---

### Detect Unused Volumes

GET /api/aws/unused-volumes

Identify unattached EBS volumes wasting storage cost.

---

# RDS APIs

### Fetch RDS Instances

GET /api/aws/rds

Retrieve database instance details from AWS RDS.

---

### RDS Summary

GET /api/aws/rds-summary

Return summary of RDS instances grouped by engine and status.

---

### RDS Optimization Recommendations

GET /api/aws/rds-recommendations

Generate database optimization suggestions such as:

* Enable Performance Insights
* Increase backup retention
* Instance sizing recommendations

---

# Cost Analysis APIs

### Fetch AWS Cost

GET /api/aws/cost

Retrieve cost data from AWS Cost Explorer.

---

### Cost History

GET /api/aws/cost/db

Return stored cost data from database.

---

### Cost Trend Analysis

GET /api/aws/cost-trend

Generate cost trend data for dashboard charts.

---

### Cost Waste Estimation

GET /api/aws/cost-estimate

Estimate monthly waste cost caused by idle resources.

---

# FinOps Insight APIs

### Waste Report

GET /api/aws/waste-report

Combine infrastructure analysis to detect wasted resources.

---

### Optimization Score

GET /api/aws/optimization-score

Generate a cloud infrastructure health score.

---

### Resource Summary

GET /api/aws/resource-summary

Return infrastructure overview including:

* EC2 instances
* running/stopped state
* EBS volumes
* optimization score

---

# System APIs

### AWS Data Sync

POST /api/aws/sync

Synchronize AWS infrastructure and cost data with database.

---

### Dashboard Summary

GET /api/aws/summary

Return overall system statistics for dashboard display.


# Future Enhancements

The platform will continue expanding with additional AWS services.

Upcoming modules include:

* S3 storage optimization
* Lambda monitoring
* VPC network analysis
* AI recommendation engine
* Cost forecasting using ML
* Anomaly detection

---

















