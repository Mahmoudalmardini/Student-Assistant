# How to Run the Student Assistant Application

This document describes the different ways to run the Student Assistant application.

## Prerequisites

- **Docker Desktop** installed and running
- **Node.js 18+** installed
- **npm** installed

## Quick Start (Recommended)

### Windows (PowerShell)

Run the startup script:

```powershell
.\start-app.ps1
```

### Linux/Mac (Bash)

Make the script executable and run:

```bash
chmod +x start-app.sh
./start-app.sh
```

The script will:
1. Check if Docker is running
2. Start the PostgreSQL database container
3. Start the backend API server (in a new window/terminal)
4. Start the frontend development server (in a new window/terminal)

## Manual Startup

### 1. Start Database

```bash
docker-compose up -d postgres
```

### 2. Start Backend

#### Windows (PowerShell)

```powershell
cd backend
.\start-local.ps1
```

Or with environment variables set manually:

```powershell
cd backend
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
npm run start:dev
```

#### Linux/Mac (Bash)

```bash
cd backend
./start-local.sh
```

Or with environment variables set manually:

```bash
cd backend
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
npm run start:dev
```

### 3. Start Frontend

Open a new terminal and run:

```bash
cd frontend
npm start
```

## Access Points

Once all services are running:

- **Frontend Application**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Documentation (Swagger)**: http://localhost:3000/api/docs
- **Database**: localhost:5434 (PostgreSQL)

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Environment Variables

### Backend Environment Variables

| Variable | Default Value | Description |
|----------|--------------|-------------|
| `DB_HOST` | `localhost` | Database host address |
| `DB_PORT` | `5434` | Database port (5434 for Docker, 5432 for local PostgreSQL) |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_NAME` | `student_assistant` | Database name |
| `JWT_SECRET` | `your-secret-key-change-in-production` | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | JWT token expiration time |
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3000` | Backend server port |
| `CORS_ORIGIN` | `http://localhost:4200,http://localhost:3000` | Allowed CORS origins |

### Frontend Environment Variables

The frontend uses Angular's environment configuration files:
- `frontend/src/environments/environment.ts` (development)
- `frontend/src/environments/environment.prod.ts` (production)

## Stopping the Application

### Windows

Close the PowerShell windows running the backend and frontend, then:

```powershell
docker-compose down
```

### Linux/Mac

If you used the startup script, you can stop services with:

```bash
./stop-app.sh
```

Or manually:

```bash
# Stop backend (if running in background)
kill $(cat backend.pid) 2>/dev/null

# Stop frontend (if running in background)
kill $(cat frontend.pid) 2>/dev/null

# Stop database
docker-compose down
```

## Troubleshooting

### Port Already in Use

If port 3000 or 4200 is already in use:

1. Find the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr ":3000"
   
   # Linux/Mac
   lsof -i :3000
   ```

2. Kill the process or change the port in the environment variables

### Database Connection Issues

1. Verify Docker container is running:
   ```bash
   docker-compose ps postgres
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Ensure the port is correct (5434 for Docker setup)

### Backend Won't Start

1. Check if dependencies are installed:
   ```bash
   cd backend
   npm install
   ```

2. Verify environment variables are set correctly

3. Check backend logs for errors

### Frontend Won't Start

1. Check if dependencies are installed:
   ```bash
   cd frontend
   npm install
   ```

2. Verify Node.js version is 18+
   ```bash
   node --version
   ```

3. Check for port conflicts

## Development Workflow

For active development:

1. **Database**: Keep running in Docker (`docker-compose up -d postgres`)
2. **Backend**: Run with watch mode (`npm run start:dev`) - auto-reloads on changes
3. **Frontend**: Run with Angular CLI (`npm start`) - auto-reloads on changes

Both backend and frontend support hot-reload during development.

