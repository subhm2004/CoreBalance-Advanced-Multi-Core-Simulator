# 🐳 Docker Deployment Guide for CoreBalance

## Local Development with Docker Compose

### **1. Prerequisites**

- Docker installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- Git

### **2. Build and Run Locally**

```bash
# Navigate to project root
cd /Users/shubhammalik/Desktop/OS\ Project

# Build images
docker-compose build

# Start all services
docker-compose up

# Visit in browser
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

### **3. Development Mode**

```bash
# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up
```

---

## Production Deployment Platforms

### **Railway.app** (Recommended - Easiest)

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign in with GitHub
   - Create new project

2. **Connect Repository**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `CoreBalance-Advanced-Multi-Core-Simulator`
   - Railway auto-detects Docker

3. **Deploy**
   - Railway builds and deploys automatically
   - Get public URL instantly
   - Custom domain support

**URL Format**: `https://corebalance-production.railway.app`

---

### **Render.com**

1. **Create Account** at https://render.com
2. **Create Web Service**
   - Connect GitHub repository
   - Select `Docker` as build type
   - Set port: `3000` (frontend)

3. **Environment Variables**

   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com
   PORT=3000
   ```

4. **Deploy** - Takes ~5 minutes

---

### **Fly.io**

1. **Install Fly CLI**

   ```bash
   brew install flyctl
   ```

2. **Login and Initialize**

   ```bash
   fly auth login
   cd /Users/shubhammalik/Desktop/OS\ Project
   fly launch
   ```

3. **Deploy**
   ```bash
   fly deploy --build-only
   ```

---

### **Docker Hub + Any VPS (Advanced)**

```bash
# Build and push to Docker Hub
docker build -t yourusername/corebalance:latest .
docker push yourusername/corebalance:latest

# On VPS (AWS EC2, DigitalOcean, etc.)
docker pull yourusername/corebalance:latest
docker run -p 3000:3000 -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://your-vps-ip:3001 \
  yourusername/corebalance:latest
```

---

## Docker Commands Reference

### **Build**

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build api

# No cache (fresh build)
docker-compose build --no-cache
```

### **Run**

```bash
# Start in foreground
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### **Manage**

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Remove containers & volumes
docker-compose down -v

# Execute command in container
docker-compose exec api sh
```

### **Clean Up**

```bash
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything
docker system prune -a
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Docker Container                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌──────────────┐   │
│  │  Frontend    │   │  API Server  │   │
│  │  Next.js     │   │  Express.js  │   │
│  │  Port 3000   │   │  Port 3001   │   │
│  └──────────────┘   └──────────────┘   │
│         ↓                   ↓           │
│  ┌─────────────────────────────────┐   │
│  │   C++ Scheduler Binaries        │   │
│  │  • FCFS, SJF, RoundRobin        │   │
│  │  • Priority, DualCore variants  │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
         ↓
   Internet (HTTPS)
```

---

## Environment Variables

### **Frontend** (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **API** (`.env`)

```
PORT=3001
NODE_ENV=production
```

### **Docker Compose**

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://api:3001
  - NODE_ENV=production
```

---

## Troubleshooting

### **Port Already in Use**

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Use different ports
docker-compose -p customport up
```

### **Build Fails**

```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache

# Check logs
docker-compose logs api
```

### **Container Exits Immediately**

```bash
# View error logs
docker-compose logs --tail=50

# Check if ports are already in use
netstat -tulpn | grep :3000
```

### **API Not Reachable from Frontend**

- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- Check Docker network: `docker network ls`
- Use service name `http://api:3001` within containers

---

## Performance Tips

1. **Multi-stage builds** (already implemented)
   - Reduces final image size
   - Faster deployments

2. **Alpine Linux** (already used)
   - Small base image (~5MB)
   - Fast container startup

3. **Production mode**
   - Set `NODE_ENV=production`
   - Disables development tools

4. **Resource limits**
   ```yaml
   services:
     api:
       deploy:
         resources:
           limits:
             cpus: "0.5"
             memory: 512M
   ```

---

## Next Steps

✅ **Completed:**

- [x] Dockerfile created
- [x] Docker Compose configured
- [x] Multi-stage build setup
- [x] Environment variables configured

🚀 **Ready to Deploy:**

1. Choose platform (Railway recommended)
2. Connect GitHub
3. Docker auto-deploys
4. Share URL!


 
