# Start Frontend Server Only
# This script starts only the frontend development server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Assistant - Frontend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting frontend server..." -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Green
Write-Host ""

cd frontend
npm start

