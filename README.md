# Custom codes Microservice

This microservice is responsible for user custom codes using Node.js and NestJS as the development framework, DynamoDB
as the NoSQL database, and Dynamoose as the ORM for interaction with DynamoDB.

## Requirements

- Node.js (v14 or higher)
- NestJS (v7 or higher)
- AWS DynamoDB
- Dynamoose (v2 or higher)
- AWS SDK for Node.js
- [Wg-infra](https://github.com/ErgonStreamGH/wg-infra) - Deploy services with Terraform


## Install

### 1. Clone the Repository

```sh
git clone https://github.com/WalletGuruLLC/wg-backend-codes.git
cd wg-backend-codes
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add:

```ini
AWS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

---

### 4. Run the Application

Using **Docker Compose**:

```sh
docker-compose up
```


## Infrastructure Setup with `wg-infra`

The **wg-infra** repository is responsible for provisioning multiple AWS resources required by this project, including *
*ECR repositories, databases, IAM roles, networking, and other cloud infrastructure**.

## Ensure Consistency Across Microservices

Make sure you follow similar steps when setting up, deploying, and managing the following microservices hosted in the
respective repositories:

| **Microservice**                                | **Repository URL**                                               |
|-------------------------------------------------|------------------------------------------------------------------|
| Authentication Service (`backend-auth`)         | [GitHub Repo](https://github.com/WalletGuruLLC/backend-auth)     |
| Notification Service (`backend-notification`)   | [GitHub Repo](https://github.com/your-org/backend-notification)  |
| Admin Frontend (`frontend-admin`)               | [GitHub Repo](https://github.com/WalletGuruLLC/frontend-admin)   |
| Wallet Service (`backend-wallet`)               | [GitHub Repo](https://github.com/WalletGuruLLC/backend-wallet)   |
| Countries Now Service (`backend-countries-now`) | [GitHub Repo](https://github.com/ErgonStreamGH/wg-countries-now) |
| Codes Service (`backend-codes`)                 | [GitHub Repo](https://github.com/ErgonStreamGH/wg-backend-codes) |

Each microservice should:

1️⃣ Deploy the dependencies using Terraform in the **wg-infra** repository
2️⃣ Store environment variables securely in **AWS Secrets Manager**
3️⃣ Use **Docker Compose** for local development