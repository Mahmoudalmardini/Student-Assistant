# Student Assistant Backend - Setup Guide

## Quick Start (Recommended)

### Option 1: Using Docker (No Dependencies Required)

1. **Ensure Docker Desktop is installed and running**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Start Docker Desktop

2. **Run the application**
   ```bash
   # Clone the repository
   git clone https://github.com/Mahmoudalmardini/Student-Assistant.git
   cd Student-Assistant
   
   # Start with Docker Compose
   docker-compose up --build
   ```

3. **Access the application**
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

### Option 2: Manual Setup (Requires Dependencies)

#### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

#### Backend Setup
```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the development server
npm run start:dev
```

## Service Details

### Backend (NestJS)
- **Port**: 3000
- **Database**: PostgreSQL
- **Features**: REST API, WebSocket, JWT Auth, Account Management
- **Documentation**: Swagger UI at `/api/docs`

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: student_assistant
- **Credentials**: postgres/postgres

## Default Credentials

### Super Admin Account
- **Username**: `admin`
- **Password**: `admin123`

This account is automatically created when the application starts for the first time.

## API Testing

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

### Common Issues

1. **Port Already in Use**
   - Change ports in `docker-compose.yml`
   - Or stop conflicting services

2. **Docker Build Fails**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild: `docker-compose up --build --force-recreate`

3. **Database Connection Issues**
   - Ensure PostgreSQL container is running
   - Check database credentials in `.env` file
   - Verify database exists: `createdb student_assistant`

4. **Backend Won't Start**
   - Check if all dependencies are installed: `npm install`
   - Verify environment variables are set correctly
   - Check the logs: `npm run start:dev`

### Testing the Backend

Run the test script to verify the backend is working:

```bash
cd backend
node test-account-management.js
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs postgres

# View backend logs in development
npm run start:dev
```

## Development Workflow

### Hot Reload Development

1. **Start database only**
   ```bash
   docker-compose up postgres
   ```

2. **Run backend locally for development**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   ```

### Production Build

```bash
# Build and start in production mode
cd backend
npm run build
npm run start:prod
```

## Environment Configuration

Copy `backend/.env.example` to `backend/.env` and modify as needed:

```bash
cd backend
cp .env.example .env
```

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=student_assistant

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:4200
```

## Account Management Features

### Supported User Roles
1. **Super Admin**: Can create all account types including other Admins
2. **Admin**: Can create all account types EXCEPT other Admins
3. **Transportation Supervisor**: Fleet management, route optimization
4. **College Supervisor**: Student monitoring, academic reports
5. **Bus Driver**: Route management, location updates
6. **Student**: Bus tracking, schedule viewing

### Account Creation Rules

#### Admin, Transportation Supervisor, College Supervisor, Bus Driver
- First Name
- Last Name
- Username
- Password
- Confirm Password

#### Student
- First Name
- Last Name
- University ID (instead of username)
- Password
- Confirm Password

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Account Management
- `POST /accounts` - Create new account
- `GET /accounts` - Get all accounts
- `GET /accounts/:id` - Get account by ID
- `PATCH /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account
- `GET /accounts/role/:role` - Get accounts by role

### Transportation
- `GET /buses` - Get all buses
- `POST /buses` - Create bus
- `GET /routes` - Get all routes
- `POST /routes` - Create route

### Tracking
- `GET /tracking/buses/active` - Get active buses
- `POST /tracking/bus/:id/location` - Update bus location

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs [service-name]`
2. Verify all ports are available
3. Ensure Docker Desktop is running
4. Try rebuilding: `docker-compose up --build`
5. Check the API documentation at http://localhost:3000/api/docs
6. Review the troubleshooting section above