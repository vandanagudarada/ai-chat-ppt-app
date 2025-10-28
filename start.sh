#!/bin/bash

# AI Chat PPT App - Start Script
echo "🚀 Starting AI Chat PPT App..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

echo "✅ Dependencies installed!"
echo ""
echo "Starting servers..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend in background
cd frontend && npm run serve &
FRONTEND_PID=$!

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

wait

