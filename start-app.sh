#!/bin/bash

# Student Assistant - Application Startup Script
# This script starts the database, backend, and frontend services

echo "========================================"
echo "Student Assistant - Starting Application"
echo "========================================"
echo ""

# Check if Docker is running
echo "[1/3] Checking Docker..."
if ! docker ps &> /dev/null; then
    echo "✗ Docker is not running. Please start Docker Desktop first."
    exit 1
fi
echo "✓ Docker is running"

# Start database container
echo "[2/3] Starting database..."
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "Starting PostgreSQL container..."
    docker-compose up -d postgres
    sleep 3
    echo "✓ Database started"
else
    echo "✓ Database is already running"
fi

# Start backend
echo "[3/3] Starting backend..."
echo "Backend will run on: http://localhost:3000"
echo "API Docs will be available at: http://localhost:3000/api/docs"
echo ""

# Set backend environment variables
export DB_HOST=localhost
export DB_PORT=5434
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_NAME=student_assistant
export JWT_SECRET=your-secret-key-change-in-production
export JWT_EXPIRES_IN=24h
export NODE_ENV=development
export PORT=3000
export CORS_ORIGIN=http://localhost:4200,http://localhost:3000

# Start backend in background (Linux/Mac)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    cd backend
    npm run start:dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    cd ..
    echo "✓ Backend started (PID: $BACKEND_PID)"
    sleep 2
fi

# Start frontend
echo "Starting frontend..."
echo "Frontend will run on: http://localhost:4200"
echo ""

if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    cd frontend
    npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    cd ..
    echo "✓ Frontend started (PID: $FRONTEND_PID)"
fi

echo ""
echo "========================================"
echo "Application Started Successfully!"
echo "========================================"
echo ""
echo "Services:"
echo "  • Database:     Running on port 5434"
echo "  • Backend API:  http://localhost:3000"
echo "  • API Docs:     http://localhost:3000/api/docs"
echo "  • Frontend:     http://localhost:4200"
echo ""
echo "Default Login Credentials:"
echo "  • Username: admin"
echo "  • Password: admin123"
echo ""
echo "To stop the services:"
echo "  ./stop-app.sh"
echo "  or kill the processes manually"
echo ""

