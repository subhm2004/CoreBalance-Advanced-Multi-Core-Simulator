#!/bin/bash

# 🐳 Docker Installation & Setup Script for CoreBalance

echo "🐳 CoreBalance Docker Setup"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found!"
    echo ""
    echo "📥 Installing Docker Desktop for macOS..."
    echo ""
    echo "Option 1: Using Homebrew (Recommended)"
    echo "  brew install --cask docker"
    echo ""
    echo "Option 2: Direct Download"
    echo "  Visit: https://www.docker.com/products/docker-desktop"
    echo ""
    exit 1
fi

echo "✅ Docker is installed: $(docker --version)"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose not found (using 'docker compose' instead)"
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
    echo "✅ Docker Compose is installed: $($COMPOSE_CMD --version)"
fi

# Start Docker daemon if not running
if ! docker info &> /dev/null; then
    echo "⏳ Starting Docker daemon..."
    open /Applications/Docker.app
    sleep 5
fi

echo ""
echo "📂 Project Structure:"
ls -la | grep -E "Dockerfile|docker-compose"

echo ""
echo "🔨 Building Docker images..."
$COMPOSE_CMD build

echo ""
echo "✅ Build complete!"
echo ""
echo "🚀 Start services with:"
echo "   $COMPOSE_CMD up"
echo ""
echo "📍 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:3001"
echo ""
