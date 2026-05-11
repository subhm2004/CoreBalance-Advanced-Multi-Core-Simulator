#!/bin/bash

# Start script for Quantum Queue - Starts both API and Frontend servers

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Always execute from repository root, even if script is called elsewhere
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

is_port_in_use() {
    local port="$1"
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

find_available_port() {
    for port in "$@"; do
        if ! is_port_in_use "$port"; then
            echo "$port"
            return 0
        fi
    done
    return 1
}

# Check if C++ binary exists
BINARY_PATH="cpp/build/bin/scheduler"
if [ ! -f "$BINARY_PATH" ]; then
    echo -e "${RED}❌ C++ scheduler binary not found!${NC}"
    echo -e "${YELLOW}Please run ./build.sh first${NC}"
    exit 1
fi

# Check if node_modules exist
if [ ! -d "api/node_modules" ]; then
    echo -e "${YELLOW}⚠️  API dependencies not installed. Installing...${NC}"
    cd api && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed. Installing...${NC}"
    cd frontend && npm install && cd ..
fi

# Pick free ports to avoid conflicts with other local projects
API_PORT=$(find_available_port 3001 3002 3004 3011)
FRONTEND_PORT=$(find_available_port 3000 3003 3005 3010)

if [ -z "$API_PORT" ] || [ -z "$FRONTEND_PORT" ]; then
    echo -e "${RED}❌ Could not find a free port for API or Frontend.${NC}"
    echo -e "${YELLOW}Please free a port and try again.${NC}"
    exit 1
fi

if [ "$API_PORT" != "3001" ]; then
    echo -e "${YELLOW}⚠️  Port 3001 is busy. Using API port ${API_PORT}.${NC}"
fi
if [ "$FRONTEND_PORT" != "3000" ]; then
    echo -e "${YELLOW}⚠️  Port 3000 is busy. Using Frontend port ${FRONTEND_PORT}.${NC}"
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill "$API_PID" 2>/dev/null
    kill "$FRONTEND_PID" 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}🚀 Starting Quantum Queue...${NC}"
echo ""

# Start API server in background
echo -e "${GREEN}📡 Starting API server on port ${API_PORT}...${NC}"
cd api
PORT="$API_PORT" node server.js > ../api.log 2>&1 &
API_PID=$!
cd ..

# Wait a bit for API to start
sleep 2

# Start Frontend server in background
echo -e "${GREEN}🎨 Starting Frontend server on port ${FRONTEND_PORT}...${NC}"
cd frontend
# Fresh .next avoids broken webpack chunk refs (e.g. Cannot find module './682.js') after dependency or branch changes.
npm run clean >/dev/null 2>&1 || rm -rf .next
CHOKIDAR_USEPOLLING=1 WATCHPACK_POLLING=true NEXT_PUBLIC_API_URL="http://localhost:${API_PORT}" npx next dev -p "$FRONTEND_PORT" > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a bit for Frontend to start
sleep 3

echo ""
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo -e "${BLUE}📊 API Server:${NC}    http://localhost:${API_PORT}"
echo -e "${BLUE}🎨 Frontend:${NC}      http://localhost:${FRONTEND_PORT}"
echo -e "${BLUE}🩺 Health Check:${NC}  http://localhost:${API_PORT}/health"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for both processes
wait $API_PID $FRONTEND_PID
