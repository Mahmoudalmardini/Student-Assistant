# Student Assistant API Documentation

## Overview
This document provides comprehensive API documentation for the Student Assistant backend system. The API is built with NestJS and provides endpoints for managing users, transportation, tracking, and academic operations.

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Most endpoints require authentication via Bearer token.

### Authentication Flow
1. **Login**: POST `/auth/login` - Get JWT token
2. **Use Token**: Include `Authorization: Bearer <token>` header in subsequent requests

## User Roles
The system supports the following user roles with different permission levels:

- `super_admin` - Full system access
- `admin` - Administrative access
- `transportation_supervisor` - Transportation management
- `college_supervisor` - College management
- `bus_driver` - Bus operation and location updates
- `student` - Basic access for students

---

## API Endpoints

### 🔐 Authentication

#### POST `/auth/login`
Login to get JWT token.

**Request Body:**
```json
{
  "identifier": "johndoe_admin",  // Username for non-students or University ID for students
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "johndoe_admin",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "isActive": true
  }
}
```

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "student",
  "studentId": "STU001",
  "collegeId": "college-uuid"
}
```

---

### 👥 User Management

#### GET `/users`
Get all users (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "johndoe_admin",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/users/:id`
Get user by ID.

**Headers:** `Authorization: Bearer <token>`

#### GET `/users/role/:role`
Get users by role (Admin/Super Admin/College Supervisor only).

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `role`: One of the user roles (super_admin, admin, transportation_supervisor, college_supervisor, bus_driver, student)

#### PATCH `/users/:id`
Update user (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "email": "updated@example.com",
  "isActive": true
}
```

#### DELETE `/users/:id`
Delete user (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

---

### 🏛️ Account Management

#### POST `/accounts`
Create a new account (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body (Admin):**
```json
{
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "username": "admin_user",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Request Body (Student):**
```json
{
  "role": "student",
  "studentFirstName": "Student",
  "studentLastName": "Name",
  "universityId": "STU001",
  "studentPassword": "password123",
  "studentConfirmPassword": "password123"
}
```

**Request Body (Driver):**
```json
{
  "role": "bus_driver",
  "driverFirstName": "Driver",
  "driverLastName": "Name",
  "driverUsername": "driver_user",
  "driverPassword": "password123",
  "driverConfirmPassword": "password123"
}
```

#### GET `/accounts`
Get all accounts (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

#### GET `/accounts/role/:role`
Get accounts by role (Admin/Super Admin/College Supervisor only).

**Headers:** `Authorization: Bearer <token>`

#### GET `/accounts/:id`
Get account by ID (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/accounts/:id`
Update account (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/accounts/:id`
Delete account (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

---

### 🏫 College Management

#### POST `/colleges`
Create a new college (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Engineering College",
  "description": "College of Engineering and Technology",
  "location": "Main Campus, Building A"
}
```

#### GET `/colleges`
Get all colleges.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Engineering College",
    "description": "College of Engineering and Technology",
    "location": "Main Campus, Building A",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/colleges/:id`
Get college by ID.

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/colleges/:id`
Update college (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/colleges/:id`
Delete college (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

---

### 🚌 Bus Management

#### POST `/buses`
Create a new bus (Admin/Super Admin/Transportation Supervisor only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "plateNumber": "ABC-123",
  "model": "Mercedes Sprinter",
  "capacity": 25,
  "driverId": "driver-uuid"
}
```

#### GET `/buses`
Get all buses.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "plateNumber": "ABC-123",
    "model": "Mercedes Sprinter",
    "capacity": 25,
    "isActive": true,
    "currentLatitude": 40.7128,
    "currentLongitude": -74.0060,
    "lastLocationUpdate": "2024-01-01T12:00:00.000Z",
    "driverId": "driver-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/buses/:id`
Get bus by ID.

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/buses/:id`
Update bus (Admin/Super Admin/Transportation Supervisor only).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/buses/:id`
Delete bus (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/buses/:id/location`
Update bus location (Bus Driver only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

---

### 🛣️ Route Management

#### POST `/routes`
Create a new route (Admin/Super Admin/Transportation Supervisor only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Campus to Downtown",
  "description": "Route from main campus to downtown area",
  "waypoints": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "name": "Main Campus"
    },
    {
      "latitude": 40.7589,
      "longitude": -73.9851,
      "name": "Downtown Station"
    }
  ],
  "distance": 15.5,
  "estimatedDuration": 30
}
```

#### GET `/routes`
Get all routes.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Campus to Downtown",
    "description": "Route from main campus to downtown area",
    "waypoints": [
      {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "name": "Main Campus"
      }
    ],
    "distance": 15.5,
    "estimatedDuration": 30,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/routes/:id`
Get route by ID.

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/routes/:id`
Update route (Admin/Super Admin/Transportation Supervisor only).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/routes/:id`
Delete route (Admin/Super Admin only).

**Headers:** `Authorization: Bearer <token>`

---

### 📍 Tracking & Location

#### POST `/tracking/bus/:busId/location`
Update bus location (Bus Driver only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "heading": 180
}
```

#### GET `/tracking/bus/:busId/history`
Get bus location history (Admin/Super Admin/Transportation Supervisor/Student).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "busId": "bus-uuid",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 45.5,
    "heading": 180,
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### GET `/tracking/buses/active`
Get all active bus locations.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "busId": "bus-uuid",
    "plateNumber": "ABC-123",
    "currentLatitude": 40.7128,
    "currentLongitude": -74.0060,
    "lastLocationUpdate": "2024-01-01T12:00:00.000Z",
    "driver": {
      "id": "driver-uuid",
      "firstName": "Driver",
      "lastName": "Name"
    }
  }
]
```

---

### 🤖 AI & Semester Planner

#### POST `/ai/semester-plan`
Generate a semester plan using rules plus an n8n workflow.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentId": "uuid",
  "requestedCredits": 15,
  "semesterId": "uuid"
}
```

**Response:**
```json
{
  "studentId": "uuid",
  "requestedCredits": 15,
  "assignments": [
    {
      "courseCode": "CS101",
      "sectionAssignments": [
        { "type": "THEORY", "dayOfWeek": "MON", "slots": ["P1", "P2"] }
      ]
    }
  ],
  "validation": { "valid": true, "items": [], "totalCredits": 15 },
  "rationale": "string | null",
  "score": 0.86,
  "source": "n8n | fallback"
}
```

Environment variables:
- `N8N_SEMESTER_PLANNER_URL`: n8n webhook URL
- `AI_BALANCE_WEIGHT`: 0..1 balance weight (default 0.4)


### 📱 Mobile

#### GET `/mobile/me/summary`
Get authenticated student summary: name, bus registration status, cumulative and per-semester GPAs with classification, and courses with status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "name": "Student Name",
  "busRegistered": true,
  "cumulativeGpa": { "value": 3.22, "classification": "very good" },
  "semesterGpas": [
    { "semesterId": "uuid", "semesterName": "2024-2025 Fall", "value": 3.1, "classification": "very good" }
  ],
  "courses": [
    {
      "courseId": "uuid",
      "code": "CS101",
      "name": "Intro to CS",
      "creditHours": 3,
      "semesterId": "uuid",
      "semesterName": "2024-2025 Fall",
      "gradeNumeric": 88,
      "gradePoint": 3.7,
      "status": "Pass"
    }
  ]
}
```

---

## Error Responses

### Common Error Codes

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript Examples

#### Login Function
```javascript
async function login(identifier, password) {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

#### Authenticated Request Function
```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
    
    return response;
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}
```

#### Get All Buses
```javascript
async function getAllBuses() {
  try {
    const response = await makeAuthenticatedRequest('http://localhost:3000/buses');
    
    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching buses:', error);
    throw error;
  }
}
```

#### Update Bus Location
```javascript
async function updateBusLocation(busId, latitude, longitude, speed, heading) {
  try {
    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/tracking/bus/${busId}/location`,
      {
        method: 'POST',
        body: JSON.stringify({
          latitude,
          longitude,
          speed,
          heading,
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update bus location');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating bus location:', error);
    throw error;
  }
}
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function BusList() {
  const { data: buses, loading, error } = useApi('http://localhost:3000/buses');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {buses?.map(bus => (
        <div key={bus.id}>
          <h3>{bus.plateNumber}</h3>
          <p>Model: {bus.model}</p>
          <p>Capacity: {bus.capacity}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## WebSocket Support

The system also supports real-time updates via WebSocket for bus tracking:

### WebSocket Connection
```javascript
const socket = io('http://localhost:3000');

// Listen for bus location updates
socket.on('busLocationUpdate', (data) => {
  console.log('Bus location updated:', data);
  // Update your UI with new location data
});

// Listen for new bus assignments
socket.on('busAssigned', (data) => {
  console.log('Bus assigned:', data);
  // Update your UI with new bus assignment
});
```

---

## Testing the API

### Using cURL

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin", "password": "admin123"}'
```

#### Get All Buses (with token)
```bash
curl -X GET http://localhost:3000/buses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
Import the provided Postman collection: `Student-Assistant-Complete-API.postman_collection.json`

---

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Running the Application
```bash
# Install dependencies
npm install

# Start database (Docker)
docker-compose up -d postgres

# Set environment variables
export DB_HOST=localhost
export DB_PORT=5434
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_NAME=student_assistant

# Start the application
npm run start:dev
```

### Default Super Admin Account
- **Username**: `admin`
- **Password**: `admin123`

---

## Support

For technical support or questions about the API, please refer to the Swagger documentation available at:
```
http://localhost:3000/api/docs
```

This interactive documentation provides a complete API reference with the ability to test endpoints directly from the browser.
