# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- C++ compiler (GCC/Clang) with C++17 support
- CMake 3.10+
- Node.js 18+
- npm or yarn

## One-Command Setup

Run the build script:
```bash
./build.sh
```

This will:
1. Build the C++ scheduler binary
2. Install API dependencies
3. Install frontend dependencies

## Manual Setup

### Step 1: Build C++ Scheduler
```bash
cd cpp
mkdir -p build
cd build
cmake ..
make
```

### Step 2: Install API Dependencies
```bash
cd ../../api
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Option 1: Single Command (Recommended)
```bash
./start.sh
```

This starts both servers automatically:
- API on `http://localhost:3001`
- Frontend on `http://localhost:3000`

Press `Ctrl+C` to stop both.

### Option 2: Manual Start (Separate Terminals)

**Terminal 1: Start API Server**
```bash
cd api
npm run dev
```
API runs on `http://localhost:3001`

**Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## Testing

1. Open `http://localhost:3000` in your browser
2. Configure processes (default: 4 sample processes)
3. Select an algorithm or choose "Compare All"
4. Click "Run Schedule" or "Compare All Algorithms"
5. View Gantt charts and performance metrics

## Troubleshooting

### C++ Binary Not Found
- Ensure you've built the C++ scheduler: `cd cpp/build && cmake .. && make`
- Check binary exists at: `cpp/build/bin/scheduler`
- On Windows, binary may be `scheduler.exe`

### API Connection Errors
- Verify API server is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local` (defaults to `http://localhost:3001`)

### Port Already in Use
- Change API port: `PORT=3002 npm run dev` in `api/` directory
- Update frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3002`
