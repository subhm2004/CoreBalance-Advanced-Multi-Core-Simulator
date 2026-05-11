# 🐳 Quick Start: Docker Deployment for CoreBalance

## ⚡ 3-Minute Setup

### **Step 1: Install Docker**

**macOS:**
```bash
# Using Homebrew (easiest)
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

Then open Docker.app from Applications folder.

### **Step 2: Build & Run Locally**

```bash
# Navigate to project
cd /Users/shubhammalik/Desktop/OS\ Project

# Build all images
docker-compose build

# Start services
docker-compose up
```

### **Step 3: Test Application**

- Frontend: http://localhost:3000
- API: http://localhost:3001/health

---

## 🚀 Deploy to Railway (30 seconds)

Railway is the easiest Docker deployment platform!

### **Step 1: Create Railway Account**
- Go to https://railway.app
- Click "Start a New Project"
- Sign in with GitHub

### **Step 2: Deploy from GitHub**
1. Click "Deploy from GitHub repo"
2. Select `CoreBalance-Advanced-Multi-Core-Simulator`
3. Railway auto-detects Dockerfile
4. Click "Deploy"

### **Step 3: Get Your URL**
- Railway gives you a public URL instantly
- Share it with everyone!
- Example: `https://corebalance-prod.railway.app`

---

## 📊 Platform Comparison

| Platform | Setup Time | Cost | Docker Support |
|----------|-----------|------|-----------------|
| **Railway** | 1 min | Free ✅ | Native |
| **Render** | 3 min | Free ✅ | Native |
| **Fly.io** | 5 min | Free ✅ | Native |
| **Docker Hub** | 10 min | Free ✅ | Manual |

---

## 🔧 Docker Commands Cheatsheet

```bash
# Build
docker-compose build

# Run
docker-compose up
docker-compose up -d  # Background

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Shell access
docker-compose exec api sh
```

---

## ✅ What's Included

- **Frontend**: Next.js in production mode
- **API**: Express.js with C++ integration
- **C++ Core**: All 8 scheduling algorithms
- **Multi-stage builds**: Optimized for size & speed
- **Environment ready**: Railway, Render, Fly.io compatible

---

## 🎯 Next Steps

1. ✅ Install Docker locally (test with `docker-compose up`)
2. ✅ Deploy to Railway (connect GitHub, auto-deploy)
3. ✅ Share your live URL!

**Questions?** Check `DOCKER_DEPLOYMENT.md` for detailed guide.
