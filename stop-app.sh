#!/bin/bash

# Student Assistant - Stop Application Script
# This script stops all running services

echo "========================================"
echo "Student Assistant - Stopping Application"
echo "========================================"
echo ""

# Stop database container
echo "[1/3] Stopping database..."
docker-compose down
echo "✓ Database stopped"

# Stop backend (if PID file exists)
echo "[2/3] Stopping backend..."
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✓ Backend stopped (PID: $BACKEND_PID)"
    else
        echo "✓ Backend was not running"
    fi
    rm -f backend.pid
else
    echo "✓ Backend PID file not found"
fi

# Stop frontend (if PID file exists)
echo "[3/3] Stopping frontend..."
if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✓ Frontend stopped (PID: $FRONTEND_PID)"
    else
        echo "✓ Frontend was not running"
    fi
    rm -f frontend.pid
else
    echo "✓ Frontend PID file not found"
fi

echo ""
echo "========================================"
echo "Application Stopped Successfully!"
echo "========================================"
echo ""

