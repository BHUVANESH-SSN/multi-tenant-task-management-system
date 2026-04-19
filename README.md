# TaskFlow: Enterprise Multi-Tenant Task Management

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Namecheap](https://img.shields.io/badge/Namecheap-DE3723?style=for-the-badge&logo=namecheap&logoColor=white)](https://www.namecheap.com/)

TaskFlow is a robust, enterprise-ready multi-tenant task management system built for secure collaboration across organizations. It combines strict tenant isolation, role-based access control, detailed audit trails, and cloud-ready deployment patterns to support production workloads with clarity and control.

---

## Architecture Diagram
<img width="1013" height="621" alt="TaskFlow architecture diagram" src="https://github.com/user-attachments/assets/461b2f2d-4b39-495e-975f-a57800ddfd0c" />

## Database Schema (Core Attributes)
<img width="995" height="410" alt="TaskFlow database core schema" src="https://github.com/user-attachments/assets/24b98693-c383-4d06-8c2d-f47c8102f85f" />

## Detailed Schema
<img width="596" height="722" alt="TaskFlow detailed schema" src="https://github.com/user-attachments/assets/0c6cf6cf-3cce-4152-b54f-6a586ee14d81" />

---
## Demo Video
[!Video Link](https://vimeo.com/1184510833?share=copy&fl=sv&fe=ci)

## Key Features

- **Robust Multi-Tenancy:** Secure data isolation using an organization-based architecture so users only access data belonging to their own workspace.
- **Granular RBAC:** Distinct **Admin** and **Member** roles for controlled access to users, tasks, and audit history.
- **Advanced Task Management:** Full CRUD support for tasks with status tracking (`TODO`, `IN_PROGRESS`, `DONE`), priority levels (`LOW`, `MEDIUM`, `HIGH`), assignees, and due dates.
- **Automated Audit Logging:** Critical create, update, and delete actions are captured with change history for accountability and traceability.
- **Secure Authentication:** Supports email/password authentication with bcrypt and OAuth providers such as Google and GitHub.
- **Cloud-Ready Deployment:** Containerized with Docker and deployable through AWS Copilot to ECS Fargate environments.
- **Scalable Service Design:** Stateless frontend and backend containers are designed for horizontal scaling as traffic and tenant count grow.
- **Load-Balanced Delivery:** AWS Copilot deploys both frontend and backend as load-balanced web services, enabling clean request routing and future scale-out.

---

## Deployment & Infrastructure

TaskFlow is designed for modern AWS-based deployment with security, scalability, and operational simplicity in mind:

- **Container Orchestration:** Managed with **AWS Copilot** for repeatable environment and service provisioning.
- **Compute Platform:** Runs on **Amazon ECS with AWS Fargate**, eliminating the need to manage EC2 hosts.
- **Load Balancing:** Both `frontend` and `backend` are configured as **Load Balanced Web Service** workloads in Copilot.
- **Traffic Routing:** The frontend serves `/`, while the backend is exposed under `/api` with a dedicated `/api/health` health check.
- **TLS / HTTPS:** **AWS Certificate Manager (ACM)** is used for SSL certificate provisioning and renewal.
- **Custom Domain:** **Namecheap** domain management integrates with the AWS load balancer and alias configuration.
- **Service Networking:** **AWS Service Connect** is enabled for service-to-service communication inside the environment.

---

## Scalability & Load Balancing

TaskFlow is structured to scale beyond a single-container demo setup:

- **Application Load Balancer:** Incoming traffic is distributed through AWS-managed load balancing, improving reliability and allowing multiple service tasks behind one endpoint.
- **Horizontal Scaling Ready:** The Copilot manifests currently run with `count: 1`, but the services are stateless and can be scaled to multiple tasks as usage grows.
- **Separation of Concerns:** Frontend and backend are deployed as separate services, which allows each tier to scale independently.
- **Health Checks:** The backend exposes `/api/health`, making it suitable for load balancer health monitoring and safer rolling deployments.
- **Multi-Subnet Deployment:** The production environment manifest is configured with multiple public subnets, which supports resilient cloud networking.
- **Tenant-Safe Growth:** Because data access is scoped by `organization_id`, scaling the number of tenants does not weaken logical data isolation.

If you want to enable higher throughput in production, the next step is to increase service task counts and add autoscaling policies through Copilot or ECS service settings.

---

## Tech Stack

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Security:** [JWT](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [Passport.js](https://www.passportjs.org/)

### Frontend
- **Library:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router 6](https://reactrouter.com/)
- **API Client:** [Axios](https://axios-http.com/)

### Infrastructure & Cloud
- **Cloud Provider:** [Amazon Web Services (AWS)](https://aws.amazon.com/)
- **Container Orchestration:** [AWS Copilot CLI](https://aws.github.io/copilot-cli/)
- **Serverless Compute:** [Amazon ECS with AWS Fargate](https://aws.amazon.com/ecs/)
- **Load Balancing:** [Application Load Balancer (ALB)](https://aws.amazon.com/elasticloadbalancing/application-load-balancer/)
- **SSL Certificates:** [AWS Certificate Manager (ACM)](https://aws.amazon.com/certificate-manager/)
- **Domain Registry:** [Namecheap](https://www.namecheap.com/)

---

## Project Architecture

```text
├── docker-compose.yaml      # Orchestrates Backend, Frontend, and PostgreSQL
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Database models (Organization, User, Task, AuditLog)
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, RBAC, and error handling
│   │   ├── routes/          # REST API endpoints
│   │   ├── services/        # Business logic and database interactions
│   │   └── server.js        # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios services and interceptors
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth and shared app state
│   │   └── pages/           # Dashboard, Tasks, Audit Logs, Admin Panel
│   └── Dockerfile
└── copilot/
    ├── backend/manifest.yml
    ├── frontend/manifest.yml
    └── environments/        # Deployment environment definitions
```

---

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### One-Command Local Run

```bash
docker compose up --build
```

- **Frontend:** [http://localhost](http://localhost)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)

---

## Local Development Setup

### 1. Environment Setup
1. Create a `.env` file in the `backend/` directory using `backend/.env.example`.
2. Set your `DATABASE_URL` for PostgreSQL.
3. Add JWT and OAuth environment variables if you want to test authentication providers locally.

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Security & RBAC Implementation

TaskFlow enforces security at multiple layers:

- **Tenant Isolation:** Database access is scoped to the authenticated user's `organization_id`.
- **Role-Based Authorization:** Admins have broader control, while members are restricted to permitted operations.
- **Auditability:** Mutating actions are recorded in audit logs with actor and timestamp context.
- **Credential Security:** Passwords are hashed with bcrypt, and token-based authentication is supported.
- **OAuth Support:** Google and GitHub authentication flows are available for modern SSO-style login experiences.

---

## Production Notes

- The current Copilot manifests define both services with `count: 1` by default.
- Because the services are already configured as load-balanced web services, scaling out is mainly an infrastructure configuration step rather than an application rewrite.
- For production growth, consider adding autoscaling policies, managed database scaling, centralized logging, and monitoring/alerting.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Created with ❤️ by [BHUVANESH S](https://github.com/BHUVANESH-SSN)
