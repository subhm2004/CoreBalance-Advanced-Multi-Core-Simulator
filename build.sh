#!/bin/bash

# Build script for Quantum Queue

echo "🔨 Building C++ Scheduler..."

cd cpp
mkdir -p build
cd build
cmake ..
make

if [ $? -eq 0 ]; then
    echo "✅ C++ scheduler built successfully!"
    echo "📦 Binary location: $(pwd)/bin/scheduler"
else
    echo "❌ C++ build failed!"
    exit 1
fi

cd ../../

echo ""
echo "📦 Installing API dependencies..."
cd api
npm install
if [ $? -ne 0 ]; then
    echo "❌ API dependencies installation failed!"
    exit 1
fi
cd ../

echo ""
echo "📦 Installing Frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependencies installation failed!"
    exit 1
fi
cd ../

echo ""
echo "✅ Build complete! 🎉"
echo ""
echo "To run the application:"
echo "  Single command: ./start.sh"
echo "  Or manually:"
echo "    1. Start API: cd api && npm run dev"
echo "    2. Start Frontend: cd frontend && npm run dev"
