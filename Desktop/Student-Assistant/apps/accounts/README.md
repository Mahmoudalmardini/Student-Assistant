# Student Assistant Accounts Service

A dedicated microservice for user account management in the Student Assistant application. This service handles the creation and management of all user accounts by Super Admins and Admins.

## Features

### 👤 Account Management
- Create and manage user accounts for all roles
- Role-based permissions for account creation
- Auto-seeded Super Admin account
- Email auto-verification for admin-created accounts

### 🔒 Permission System
- **Super Admin**: Can create all user types including Admins
- **Admin**: Can create College Coordinators, Transportation Coordinators, and Students (but NOT Admins)

### 🛡️ Security Features
- Strong password requirements
- Secure password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)

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
   ACCOUNTS_PORT=3001
   MONGO_URI=mongodb://localhost:27017/student-assistant
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   ```

3. **Start the service:**
   ```bash
   npm run start:dev accounts
   ```

4. **Access the application:**
   - API: http://localhost:3001
   - Swagger Documentation: http://localhost:3001/api/docs

## Static Super Admin Account

The service automatically creates a Super Admin account on startup:

```
Username: admin
Password: admin123
Email: admin@student-assistant.com
```

**⚠️ Security Notice**: Change the super admin password immediately after first login in production environments!

## API Endpoints

### Account Creation Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/accounts/create-admin` | Create new admin user | Yes | Super Admin |
| POST | `/accounts/create-coordinator` | Create new coordinator | Yes | Super Admin / Admin |
| POST | `/accounts/create-student` | Create new student | Yes | Super Admin / Admin |

### Account Management Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/accounts/users` | List all users (with filtering) | Yes | Super Admin / Admin |
| GET | `/accounts/users/:id` | Get user by ID | Yes | Super Admin / Admin |
| PATCH | `/accounts/users/:id` | Update user details | Yes | Super Admin / Admin |
| DELETE | `/accounts/users/:id` | Delete user | Yes | Super Admin |

## Role Hierarchy

```
SUPER_ADMIN (highest privilege)
  └── ADMIN
      ├── COLLEGE_COORDINATOR
      ├── TRANSPORTATION_COORDINATOR
      └── STUDENT
```

## Permission Matrix

| Action | Super Admin | Admin | Coordinator | Student |
|--------|-------------|-------|-------------|---------|
| Create Admin | ✅ | ❌ | ❌ | ❌ |
| Create Coordinator | ✅ | ✅ | ❌ | ❌ |
| Create Student | ✅ | ✅ | ❌ | ❌ |
| View Users | ✅ | ✅ | ❌ | ❌ |
| Update User | ✅ | ✅ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ | ❌ |

## Request/Response Examples

### Login (Use Auth Service)
First, authenticate to get JWT token:
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Create Admin (Super Admin Only)
```bash
POST /accounts/create-admin
Authorization: Bearer <super_admin_jwt_token>
Content-Type: application/json

{
  "username": "admin_user",
  "email": "admin@university.edu",
  "password": "Admin@123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Admin user created successfully",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "username": "admin_user",
      "email": "admin@university.edu",
      "role": "admin"
    }
  },
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### Create Coordinator (Super Admin or Admin)
```bash
POST /accounts/create-coordinator
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "coordinator_user",
  "email": "coordinator@university.edu",
  "password": "Coordinator@123!",
  "coordinatorType": "college_coordinator"
}
```

### Create Student (Super Admin or Admin)
```bash
POST /accounts/create-student
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "student_user",
  "email": "student@university.edu",
  "password": "Student@123!"
}
```

### List Users
```bash
GET /accounts/users
Authorization: Bearer <jwt_token>

# With role filter
GET /accounts/users?role=student
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 10,
    "users": [
      {
        "id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "username": "student1",
        "email": "student1@university.edu",
        "role": "student",
        "isEmailVerified": true,
        "createdAt": "2024-01-20T10:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### Update User
```bash
PATCH /accounts/users/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "newemail@university.edu",
  "role": "college_coordinator"
}
```

### Delete User (Super Admin Only)
```bash
DELETE /accounts/users/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <super_admin_jwt_token>
```

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Development

### Available Scripts

```bash
# Development
npm run start:dev accounts    # Start with hot reload
npm run start:debug accounts  # Start with debugging

# Production
npm run build accounts        # Build the application
npm run start:prod accounts   # Start production server
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ACCOUNTS_PORT` | Service port | 3001 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/student-assistant |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - |
| `JWT_EXPIRES_IN` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | 12 |

## Integration with Auth Service

The Accounts service works alongside the Auth service:
- **Auth Service** (Port 3000): Handles authentication (login, register, password reset)
- **Accounts Service** (Port 3001): Handles account management (create, update, delete users)

Users authenticate through the Auth service and use the JWT token to access Accounts service endpoints.

## Security Best Practices

1. **Change Default Credentials**: Immediately change the super admin password after first deployment
2. **Use HTTPS**: Always use HTTPS in production
3. **Rotate Secrets**: Regularly rotate JWT secrets
4. **Monitor Access**: Keep logs of all account creation and modification activities
5. **Limit Access**: Only grant admin privileges to trusted users

## Error Handling

The service provides clear error responses:

```json
{
  "success": false,
  "error": {
    "statusCode": 409,
    "message": "User with username 'admin_user' already exists"
  },
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

## License

This project is part of the Student Assistant application.

