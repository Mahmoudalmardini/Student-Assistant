# Student Assistant - Stop Application Script
# This script stops all running services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Assistant - Stopping Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop database container
Write-Host "[1/2] Stopping database..." -ForegroundColor Yellow
docker-compose down
Write-Host "✓ Database stopped" -ForegroundColor Green

# Find and stop Node processes (backend/frontend)
Write-Host "[2/2] Stopping Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✓ Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "✓ No Node.js processes found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Application Stopped Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

