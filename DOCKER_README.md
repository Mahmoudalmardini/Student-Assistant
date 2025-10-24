# Student Assistant Backend - Docker Setup

This project has been dockerized to allow you to run the backend API and database locally without installing additional dependencies.

## Prerequisites

- Docker Desktop installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Project Structure

The project consists of two main components:

1. **Backend** (NestJS API) - Port 3000
2. **Database** (PostgreSQL) - Port 5432

## Quick Start

### 1. Clone and Navigate to Project
```bash
cd Student-Assistant
```

### 2. Build and Start All Services
```bash
docker-compose up --build
```

This command will:
- Build the backend Docker image
- Start PostgreSQL database
- Start the backend API
- Automatically seed the super admin account

### 3. Access the Application

Once all services are running, you can access:

- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Database**: localhost:5432

## Individual Service Management

### Start All Services in Background
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Clean Reset)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs postgres
```

### Rebuild a Specific Service
```bash
docker-compose up --build backend
```

## Development Mode

For development with hot reloading, you can run services individually:

### Backend Development
```bash
cd backend
docker-compose up postgres
# In another terminal
npm run start:dev
```

## Database Access

To connect to the PostgreSQL database directly:

- **Host**: localhost
- **Port**: 5432
- **Database**: student_assistant
- **Username**: postgres
- **Password**: postgres

## API Testing

### Default Super Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Using Postman
1. Import the collection: `backend/account-management.postman_collection.json`
2. Start with the login endpoint to get authentication token
3. Use the token in subsequent requests

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin", "password": "admin123"}'

# Create account (with token)
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "universityId": "12345678",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

## Troubleshooting

### Port Already in Use
If you get port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Clear Docker Cache
```bash
docker system prune -a
docker-compose down -v
docker-compose up --build
```

### Check Container Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
docker-compose exec backend sh
```

### Database Connection Issues
```bash
# Check if database is running
docker-compose exec postgres psql -U postgres -d student_assistant

# Reset database
docker-compose down -v
docker-compose up --build
```

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

- `DATABASE_HOST`: postgres
- `DATABASE_PORT`: 5432
- `DATABASE_USERNAME`: postgres
- `DATABASE_PASSWORD`: postgres
- `DATABASE_NAME`: student_assistant
- `JWT_SECRET`: your_jwt_secret_key_here

## Production Considerations

For production deployment, consider:

1. Change default passwords and secrets
2. Use environment files (`.env`)
3. Configure proper SSL certificates
4. Set up proper logging and monitoring
5. Use Docker secrets for sensitive data
6. Configure proper database backups
7. Set up health checks and monitoring

## Health Checks

The backend includes health check endpoints:

- `GET /health` - Basic health check
- `GET /health/database` - Database connection check

## Support

If you encounter any issues:

1. Check the logs: `docker-compose logs [service-name]`
2. Ensure all ports are available
3. Verify Docker Desktop is running
4. Try rebuilding: `docker-compose up --build`
5. Check the API documentation at http://localhost:3000/api/docs