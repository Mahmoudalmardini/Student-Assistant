# Student Assistant System - Backend

This is the backend API for the Student Assistant System built with NestJS, TypeORM, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Support for 6 user roles (Super Admin, Admin, Transportation Supervisor, College Supervisor, Bus Driver, Student)
- **Transportation Management**: Bus and route management with real-time tracking
- **Real-time Communication**: WebSocket support for live bus location updates
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, and validation

## User Roles

1. **Super Admin**: System configuration, all user management, analytics dashboard
2. **Admin**: General system administration, user support
3. **Transportation Supervisor**: Fleet management, route optimization, driver monitoring
4. **College Supervisor**: Student monitoring, academic reports
5. **Bus Driver**: Route management, location updates
6. **Student**: Bus tracking, schedule viewing

## Architecture

The backend follows a **Modular Monolith** architecture with **Domain-Driven Design**:

```
src/
├── core/                    # Business logic domains
│   ├── auth/               # Authentication domain
│   ├── users/              # User management domain
│   ├── transportation/     # Bus, routes, drivers domain
│   ├── academic/           # College, students domain
│   └── tracking/           # Real-time tracking domain
├── application/            # Use cases & DTOs
├── infrastructure/         # External services, DB repos
├── common/                 # Shared utilities, guards, decorators
├── config/                 # Configuration management
└── main.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file with the following variables:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=student_assistant
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:4200,http://localhost:3000
```

3. Set up PostgreSQL database:
```bash
# Create database
createdb student_assistant
```

4. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### API Documentation

Once the server is running, visit:
- API Documentation: http://localhost:3000/api/docs
- Application: http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `GET /users/role/:role` - Get users by role
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Super Admin only)

### Transportation
- `GET /buses` - Get all buses
- `POST /buses` - Create bus (Admin/Transportation Supervisor)
- `GET /buses/:id` - Get bus by ID
- `PATCH /buses/:id` - Update bus (Admin/Transportation Supervisor)
- `PATCH /buses/:id/location` - Update bus location (Bus Driver)
- `DELETE /buses/:id` - Delete bus (Admin only)

- `GET /routes` - Get all routes
- `POST /routes` - Create route (Admin/Transportation Supervisor)
- `GET /routes/:id` - Get route by ID
- `PATCH /routes/:id` - Update route (Admin/Transportation Supervisor)
- `DELETE /routes/:id` - Delete route (Admin only)

### Tracking
- `POST /tracking/bus/:busId/location` - Update bus location (Bus Driver)
- `GET /tracking/bus/:busId/history` - Get bus location history
- `GET /tracking/buses/active` - Get all active bus locations

### WebSocket Events
- `join_bus_tracking` - Join bus tracking room
- `leave_bus_tracking` - Leave bus tracking room
- `update_bus_location` - Update bus location
- `bus_location_updated` - Real-time location updates

## Database Schema

### Core Entities
- **User**: Users with roles and authentication
- **College**: Academic institutions
- **Bus**: Vehicle information and current location
- **Route**: Transportation routes with waypoints
- **BusRoute**: Bus-route assignments with schedules
- **BusLocation**: Historical location tracking

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation with class-validator
- CORS configuration
- Rate limiting
- Helmet security headers

## Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.