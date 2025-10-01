# Student Assistant Auth Service

A robust authentication microservice built with NestJS, MongoDB, and JWT for the Student Assistant application.

## Features

### 🔐 Authentication & Authorization
- User registration with email verification
- Secure login with account lockout protection
- JWT-based authentication with refresh tokens
- Role-based access control (Student, Teacher, Admin)
- Password reset functionality

### 🛡️ Security Features
- Strong password requirements
- Account lockout after failed login attempts
- Email verification for new accounts
- Secure token management
- CORS protection
- Helmet security headers

### 📚 API Documentation
- Swagger/OpenAPI documentation
- Interactive API testing interface
- Comprehensive endpoint documentation

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/student-assistant
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   ```

3. **Start the development server:**
   ```bash
   npm run start:dev
   ```

4. **Access the application:**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api/docs

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/profile` | Get user profile | Yes |

### Password Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |

### Email Verification

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/verify-email/:token` | Verify email address | No |
| POST | `/auth/resend-verification` | Resend verification email | No |

### Role-based Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/auth/test-admin` | Test admin access | Yes | Admin |
| POST | `/auth/test-teacher` | Test teacher access | Yes | Teacher/Admin |

## User Roles

- **Student**: Default role for regular users
- **Teacher**: Can access teacher-specific features
- **Admin**: Full administrative access

## Request/Response Examples

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "student"
    }
  },
  "timestamp": "2023-09-01T10:00:00.000Z"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

### Get Profile
```bash
GET /auth/profile
Authorization: Bearer <access_token>
```

## Security Considerations

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Account Lockout
- Accounts are locked after 5 failed login attempts
- Lock duration: 2 hours
- Login attempts are reset on successful login

### Token Management
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are verified on every request

## Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
```

### Project Structure

```
src/
├── common/                 # Shared utilities and decorators
│   ├── decorators/         # Custom decorators
│   ├── exceptions/         # Custom exceptions
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication and authorization guards
│   ├── interceptors/      # Response interceptors
│   └── interfaces/        # TypeScript interfaces
├── config/                # Configuration files
├── database/              # Database configuration
├── users/                 # User-related modules
│   ├── dto/              # Data Transfer Objects
│   ├── schemas/          # MongoDB schemas
│   └── users.module.ts   # Users module
├── auth.controller.ts     # Authentication controller
├── auth.service.ts        # Authentication service
├── auth.module.ts         # Authentication module
├── jwt.strategy.ts        # JWT strategy
└── main.ts               # Application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/student-assistant |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - |
| `JWT_EXPIRES_IN` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | 12 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:4200 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is part of the Student Assistant application.

