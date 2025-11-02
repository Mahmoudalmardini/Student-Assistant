# Start Backend Server Only
# This script starts only the backend API server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Assistant - Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:DB_HOST = "localhost"
$env:DB_PORT = "5434"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "postgres"
$env:DB_NAME = "student_assistant"
$env:JWT_SECRET = "your-secret-key-change-in-production"
$env:JWT_EXPIRES_IN = "24h"
$env:NODE_ENV = "development"
$env:PORT = "3000"
$env:CORS_ORIGIN = "http://localhost:4200,http://localhost:3000"

Write-Host "Environment:" -ForegroundColor Yellow
Write-Host "  Database: $env:DB_HOST`:$env:DB_PORT" -ForegroundColor White
Write-Host "  Port: $env:PORT" -ForegroundColor White
Write-Host ""

Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:3000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:3000/api/docs" -ForegroundColor Green
Write-Host ""

cd backend
npm run start:dev

