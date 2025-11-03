# Student Assistant - Application Startup Script
# This script starts the database, backend, and frontend services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Assistant - Starting Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[1/3] Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start database container
Write-Host "[2/3] Starting database..." -ForegroundColor Yellow
$dbOutput = docker-compose ps postgres --format json 2>$null
if ($dbOutput) {
    $dbStatus = $dbOutput | ConvertFrom-Json
    if ($dbStatus.State -ne "running") {
        Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
        docker-compose up -d postgres
        Start-Sleep -Seconds 3
        Write-Host "✓ Database started" -ForegroundColor Green
    } else {
        Write-Host "✓ Database is already running" -ForegroundColor Green
    }
} else {
    Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
    docker-compose up -d postgres
    Start-Sleep -Seconds 3
    Write-Host "✓ Database started" -ForegroundColor Green
}

# Start backend
Write-Host "[3/3] Starting backend..." -ForegroundColor Yellow
Write-Host "Backend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs will be available at: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host ""

# Set backend environment variables
$backendEnv = @{
    DB_HOST = "localhost"
    DB_PORT = "5434"
    DB_USERNAME = "postgres"
    DB_PASSWORD = "postgres"
    DB_NAME = "student_assistant"
    JWT_SECRET = "your-secret-key-change-in-production"
    JWT_EXPIRES_IN = "24h"
    NODE_ENV = "development"
    PORT = "3000"
    CORS_ORIGIN = "http://localhost:4200,http://localhost:3000"
}

# Set environment variables for current session
foreach ($key in $backendEnv.Keys) {
    Set-Item -Path "env:$key" -Value $backendEnv[$key]
}

# Start backend in a new window
Write-Host "Starting backend server..." -ForegroundColor Yellow
$scriptRoot = $PSScriptRoot
if (-not $scriptRoot) {
    $scriptRoot = (Get-Location).Path
}
$backendScript = @"
`$env:DB_HOST = 'localhost'
`$env:DB_PORT = '5434'
`$env:DB_USERNAME = 'postgres'
`$env:DB_PASSWORD = 'postgres'
`$env:DB_NAME = 'student_assistant'
`$env:JWT_SECRET = 'your-secret-key-change-in-production'
`$env:JWT_EXPIRES_IN = '24h'
`$env:NODE_ENV = 'development'
`$env:PORT = '3000'
`$env:CORS_ORIGIN = 'http://localhost:4200,http://localhost:3000'

Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Student Assistant - Backend Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Running on: http://localhost:3000' -ForegroundColor Green
Write-Host 'API Docs: http://localhost:3000/api/docs' -ForegroundColor Green
Write-Host ''

cd '$scriptRoot\backend'
npm run start:dev
"@

$backendPath = Join-Path $env:TEMP "start-backend.ps1"
$backendScript | Out-File -FilePath $backendPath -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& `"$backendPath`""

Start-Sleep -Seconds 2

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""

$frontendScript = @"
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Student Assistant - Frontend Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Running on: http://localhost:4200' -ForegroundColor Green
Write-Host ''

cd '$scriptRoot\frontend'
npm start
"@

$frontendPath = Join-Path $env:TEMP "start-frontend.ps1"
$frontendScript | Out-File -FilePath $frontendPath -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& `"$frontendPath`""

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Application Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  • Database:     Running on port 5434" -ForegroundColor White
Write-Host "  • Backend API:  http://localhost:3000" -ForegroundColor White
Write-Host "  • API Docs:     http://localhost:3000/api/docs" -ForegroundColor White
Write-Host "  • Frontend:     http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "Default Login Credentials:" -ForegroundColor Yellow
Write-Host "  • Username: admin" -ForegroundColor White
Write-Host "  • Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Note: The backend and frontend are running in separate windows." -ForegroundColor Cyan
Write-Host "      Close those windows to stop the servers." -ForegroundColor Cyan
Write-Host ""

