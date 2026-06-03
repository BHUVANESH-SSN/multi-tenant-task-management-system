# CI/CD Setup Guide for Docker Compose Project

## Goal

Whenever code is pushed to GitHub:

1. GitHub Actions automatically starts.
2. Build and test the application.
3. Connect to the production server.
4. Pull latest code.
5. Rebuild Docker containers.
6. Deploy the latest version.

---

## Architecture

```text
Developer
    ↓
git push
    ↓
GitHub Repository
    ↓
GitHub Actions
    ↓
Build & Test
    ↓
SSH into VPS
    ↓
git pull
    ↓
docker compose up -d --build
    ↓
Application Updated
```

---

## Prerequisites

### Local Machine

* Git
* GitHub Account
* Docker
* Docker Compose

### Server (Ubuntu VPS)

* Git
* Docker
* Docker Compose
* SSH Access

Verify installation:

```bash
docker --version
docker compose version
git --version
```

---

## Project Structure

```text
project-root/
│
├── frontend/
├── backend/
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

---

## Step 1: Generate SSH Key

On local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions"
```

Copy public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Add it to:

```text
Server → ~/.ssh/authorized_keys
```

---

## Step 2: Add GitHub Secrets

Repository Settings → Secrets and Variables → Actions

Create:

```text
HOST=<server-ip>
USERNAME=<server-user>
SSH_KEY=<private-key-content>
```

Example:

```text
HOST=192.168.1.100
USERNAME=ubuntu
```

---

## Step 3: Create GitHub Workflow

Create:

```text
.github/workflows/deploy.yml
```

```yaml
name: Deploy Application

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Deploy To VPS
        uses: appleboy/ssh-action@v1.2.0

        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}

          script: |
            cd /home/ubuntu/project

            git pull origin main

            docker compose up -d --build
```

---

## Step 4: Initial Server Setup

SSH into server:

```bash
ssh ubuntu@SERVER_IP
```

Clone repository once:

```bash
git clone https://github.com/username/project.git
```

Move into project:

```bash
cd project
```

Start application:

```bash
docker compose up -d --build
```

---

## Deployment Flow

Every push triggers:

```bash
git push origin main
```

GitHub Actions executes:

```bash
cd /home/ubuntu/project

git pull origin main

docker compose up -d --build
```

Application updates automatically.

---

## Optional CI Checks

Before deployment:

```yaml
- name: Install Dependencies
  run: npm install

- name: Run Tests
  run: npm test

- name: Build Project
  run: npm run build
```

Deployment occurs only if all checks pass.

---

## Production Improvements

### Use Docker Registry

Instead of building on the server:

```text
GitHub Actions
    ↓
Build Docker Image
    ↓
Push to Registry
    ↓
Server Pulls Image
    ↓
docker compose up -d
```

Benefits:

* Faster deployments
* Consistent builds
* Easier rollbacks

---

## Monitoring Stack

Recommended:

* Prometheus
* Grafana
* Loki
* Nginx

Monitor:

* CPU Usage
* RAM Usage
* Container Health
* API Response Time
* Error Rates

---

## Useful Commands

View containers:

```bash
docker ps
```

View logs:

```bash
docker compose logs -f
```

Restart services:

```bash
docker compose restart
```

Rebuild services:

```bash
docker compose up -d --build
```

Stop services:

```bash
docker compose down
```

---

## Future Upgrades

* Nginx Reverse Proxy
* HTTPS with Let's Encrypt
* Docker Registry (GHCR)
* Prometheus
* Grafana
* Loki
* Kubernetes
* ArgoCD
* Terraform

This setup provides a complete beginner-to-production CI/CD pipeline using GitHub Actions, Docker Compose, and an Ubuntu VPS.
