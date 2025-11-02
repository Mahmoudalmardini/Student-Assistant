# Student Assistant Backend API

A comprehensive university transportation management backend system built with NestJS to provide real-time bus tracking, route management, and student assistance services.

## 🏗️ System Architecture

The Student Assistant Backend is built using **NestJS** with **Domain-Driven Design** principles, featuring:

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Role-Based Access Control (RBAC)
- **Real-time**: WebSocket support with Socket.io
- **AI Integration**: Modular structure for AI services
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate limiting

## 🎯 Key Features

### User Roles & Permissions
1. **Super Admin**: System configuration, analytics, full access
2. **Admin**: General administration, user support
3. **Transportation Supervisor**: Fleet management, route optimization
4. **College Supervisor**: Student monitoring, academic reports
5. **Bus Driver**: Route management, location updates
6. **Student**: Bus tracking, schedule viewing

### Core Functionality
- **Account Management**: Complete CRUD operations for all user roles
- **Real-time Bus Tracking**: Live location updates with WebSocket
- **Route Management**: Dynamic route creation and optimization
- **User Management**: Role-based access control with JWT authentication
- **AI Integration**: Route optimization and predictive analytics
- **Security**: JWT authentication, CORS, rate limiting, input validation

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** (for database)
- **Node.js (v18+)**
- **npm**

### Easiest Way to Run (Recommended)

#### Windows (PowerShell)
```powershell
# Start everything (database, backend, frontend)
.\start-app.ps1
```

#### Linux/Mac (Bash)
```bash
# Make scripts executable
chmod +x start-app.sh stop-app.sh

# Start everything
./start-app.sh
```

This will automatically:
1. Start the PostgreSQL database in Docker
2. Start the backend API server (http://localhost:3000)
3. Start the frontend development server (http://localhost:4200)

**Access Points:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

**Default Login:**
- Username: `admin`
- Password: `admin123`

> 📖 For detailed setup instructions, see [RUN_APP.md](RUN_APP.md)

### Manual Setup (Alternative)

#### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Mahmoudalmardini/Student-Assistant.git
cd Student-Assistant/backend

# Install dependencies
npm install

# Start database with Docker
cd ..
docker-compose up -d postgres

# Start backend (Windows)
cd backend
.\start-local.ps1

# Or start backend manually (Linux/Mac)
cd backend
./start-local.sh
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
Student-Assistant/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── core/           # Business domains
│   │   │   ├── auth/       # Authentication & JWT
│   │   │   ├── users/      # User & Account management
│   │   │   ├── transportation/ # Bus & routes management
│   │   │   ├── academic/   # College management
│   │   │   ├── tracking/   # Real-time tracking
│   │   │   └── ai/         # AI services
│   │   ├── common/         # Shared utilities
│   │   │   ├── decorators/ # Custom decorators
│   │   │   ├── entities/   # Base entities
│   │   │   ├── enums/      # Enums
│   │   │   └── guards/     # Authentication guards
│   │   ├── config/         # Configuration
│   │   └── database/       # Database seeders
│   ├── test/               # Test files
│   ├── Dockerfile          # Docker configuration
│   └── README.md
├── docker-compose.yml      # Docker orchestration
└── README.md               # This file
```

## 🔧 Technical Stack

### Backend Technologies
- **NestJS**: Progressive Node.js framework
- **TypeORM**: Object-Relational Mapping
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Socket.io**: Real-time communication
- **Swagger**: API documentation
- **Helmet**: Security middleware
- **Class-validator**: Input validation
- **Bcrypt**: Password hashing

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User login (username/password or universityId/password)
- `POST /auth/register` - User registration

### Account Management
- `POST /accounts` - Create new account (role-based)
- `GET /accounts` - Get all accounts (with pagination)
- `GET /accounts/:id` - Get account by ID
- `PATCH /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account (Super Admin only)
- `GET /accounts/role/:role` - Get accounts by role

### Transportation
- `GET /buses` - Get all buses
- `POST /buses` - Create bus
- `GET /routes` - Get all routes
- `POST /routes` - Create route

### Tracking
- `GET /tracking/buses/active` - Get active buses
- `POST /tracking/bus/:id/location` - Update bus location
- WebSocket events for real-time updates

### User Management
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions for different user roles
- **Input Validation**: Comprehensive data validation using class-validator
- **CORS Configuration**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Helmet Security**: HTTP security headers
- **Password Hashing**: Bcrypt encryption with salt rounds
- **Unique Constraints**: Username/University ID uniqueness validation

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### API Testing
Use the provided Postman collection:
- Import `backend/account-management.postman_collection.json`
- Test all endpoints with different user roles
- Verify authentication and authorization

## 🚀 Deployment

### Docker Deployment
```bash
# Using Docker Compose
docker-compose up -d

# Or build and run individually
cd backend
docker build -t student-assistant-backend .
docker run -p 3000:3000 student-assistant-backend
```

### Production Deployment
```bash
# Production build
npm run build
npm run start:prod
```

## 📊 Monitoring & Analytics

- **API Documentation**: Swagger UI at `/api/docs`
- **Real-time Monitoring**: WebSocket connection status
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Database Monitoring**: Query performance tracking

## 🔑 Default Credentials

### Super Admin Account
- **Username**: `admin`
- **Password**: `admin123`

This account is automatically created when the application starts for the first time.

## 📝 Account Creation Rules

### Super Admin
- Can create all account types including other Admins
- Static credentials (admin/admin123)

### Admin
- Can create all account types EXCEPT other Admins
- Cannot create Super Admin accounts

### Account Types & Required Fields

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the setup guide in `backend/README.md`

## 🗺️ Roadmap

- [ ] Advanced AI features implementation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with external APIs
- [ ] Performance optimizations
- [ ] Advanced caching strategies
- [ ] Microservices architecture migration

---

**Built with ❤️ for modern university transportation management**