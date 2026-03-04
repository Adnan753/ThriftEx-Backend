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

Request Body:
{
"name": "Nikhil",
"email": "[nikhil@example.com](mailto:nikhil@example.com)",
"password": "password123"
}

---

### Login User

POST /api/auth/login

Authenticate user and return JWT token.

Request Body:
{
"email": "[nikhil@example.com](mailto:nikhil@example.com)",
"password": "password123"
}

Response:
{
"token": "JWT_TOKEN"
}

---

### Protected Route Test

GET /api/protected

Requires Authorization header:

Authorization: Bearer <JWT_TOKEN>



## EC2 APIs



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

### Idle Instances Detection

GET /api/aws/idle-instances

Detect stopped EC2 instances.

---

### Optimization Recommendations

GET /api/aws/recommendations

Generate cost optimization suggestions.

---

### Instance Details

GET /api/aws/ec2/:instance_id

Return detailed instance information.

---

## Cost APIs

### Fetch Cost From AWS

GET /api/aws/cost

Fetch AWS cost data and store in database.

---

### Cost History

GET /api/aws/cost/db

Return stored cost history.

---

### Cost Trend

GET /api/aws/cost-trend

Return cost trend data for dashboard charts.

---

## System APIs

### AWS Data Sync

POST /api/aws/sync

Synchronize AWS resources and cost data with database.

---

### Dashboard Summary

GET /api/aws/summary

Return system overview including instances and total cost.
