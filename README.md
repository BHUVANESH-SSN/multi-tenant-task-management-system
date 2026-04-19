#  TaskFlow: Enterprise Multi-Tenant Task Management

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Namecheap](https://img.shields.io/badge/Namecheap-DE3723?style=for-the-badge&logo=namecheap&logoColor=white)](https://www.namecheap.com/)

TaskFlow is a robust, enterprise-ready multi-tenant task management system designed for organizational efficiency. It features strict data isolation, granular Role-Based Access Control (RBAC), and comprehensive audit trails, ensuring security and accountability across all workspaces.

---
## Architecture Diagram
<img width="1013" height="621" alt="image" src="https://github.com/user-attachments/assets/461b2f2d-4b39-495e-975f-a57800ddfd0c" />
## Database Scehma
<img width="995" height="410" alt="image" src="https://github.com/user-attachments/assets/24b98693-c383-4d06-8c2d-f47c8102f85f" />


## Key Features

- **Robust Multi-Tenancy:** Secure data isolation using an organization-based architecture. Users can only access data belonging to their specific organization.
- **Granular RBAC:** Distinct **Admin** and **Member** roles.
  - *Admins:* Full control over tasks, users, and audit logs.
  - *Members:* Task creation and management with restricted permissions for cross-user data.
- **Advanced Task Management:** Comprehensive CRUD operations with support for status tracking (`TODO`, `IN_PROGRESS`, `DONE`), priority levels (`LOW`, `MEDIUM`, `HIGH`), and due dates.
- **Automated Audit Logging:** Every critical action (create, update, delete) is automatically logged with a JSON diff of changes, providing a clear history of "who did what and when."
- **Secure Authentication:** Dual authentication strategy supporting traditional Email/Password (bcrypt) and modern OAuth (Google/GitHub) via Passport.js.
- **DevOps Ready:** Fully containerized with Docker and Docker Compose for seamless deployment and environment consistency.

---

##  Deployment & Infrastructure

TaskFlow is optimized for modern cloud-native deployment on AWS, utilizing managed services to ensure high availability, security, and scalability:

- **Container Orchestration:** Deployed using **AWS Copilot** to manage the container lifecycle.
- **Compute:** Running on **Amazon ECS (Elastic Container Service) with AWS Fargate** for serverless container execution (no EC2 instances to manage).
- **SSL/HTTPS:** Secured using **AWS Certificate Manager (ACM)** to provision and auto-renew SSL certificates.
- **Domain Management:** Custom domain registered and managed via **Namecheap**, integrated with AWS Route 53 / ALB for clean URL routing.

---

##  Tech Stack

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
- **SSL Certificates:** [AWS Certificate Manager (ACM)](https://aws.amazon.com/certificate-manager/)
- **Domain Registry:** [Namecheap](https://www.namecheap.com/)

---

##  Project Architecture

```text
├── docker-compose.yaml      # Orchestrates Backend, Frontend, and PostgreSQL
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Database models (Org, User, Task, Audit)
│   ├── src/
│   │   ├── middleware/      # Auth, RBAC, and Tenant Isolation
│   │   ├── routes/          # RESTful API Endpoints
│   │   ├── services/        # Business Logic & DB Interactions
│   │   └── server.js        # Entry point
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── context/         # Global Auth & State Management
    │   ├── api/             # API Interceptors & Service Calls
    │   ├── components/      # Reusable UI Blocks
    │   └── pages/           # Dashboard, Task Views, Admin Panel
    └── Dockerfile
```

---

##  Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)

### One-Command Deployment
```bash
docker compose up --build
```
- **Frontend:** [http://localhost](http://localhost)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)

---

##  Local Development Setup

### 1. Database & Environment
1. Create a `.env` file in the `backend/` directory (see `backend/.env.example`).
2. Set your `DATABASE_URL` (PostgreSQL).

### 2. Backend Installation
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

---

##  Security & RBAC Implementation

Data security is baked into the core of TaskFlow:
- **Tenant Isolation:** Every database query is scoped to the `organization_id` of the authenticated user.
- **JWT Refresh Strategy:** Uses secure HTTP-only cookies (or protected headers) for token management.
- **Audit Logs:** Implemented via a centralized service to ensure every mutation is recorded with the associated user and timestamp.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ by [BHUVANESH S](https://github.com/BHUVANESH-SSN)*
