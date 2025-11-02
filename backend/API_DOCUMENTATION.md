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

### 🏠 Root

#### GET `/`
**Function:** Health check endpoint that returns a simple hello message to verify the API is running.

**Authentication:** Not required

**Response:**
```
Hello World!
```

---

### 🔐 Authentication

#### POST `/auth/login`
**Function:** Authenticates a user and returns a JWT access token. This is the primary endpoint for user authentication. Users can login using their username (for non-students) or University ID (for students).

**Authentication:** Not required (but logs you in)

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
**Function:** Registers a new user account in the system. Creates a new user with the specified role and information. Supports registration for students, admins, drivers, and other roles.

**Authentication:** Not required

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
  "driverLicenseNumber": "DL123456",
  "collegeId": "college-uuid"
}
```

**Response:** Returns the created user object with basic information.

---

### 👥 User Management

#### GET `/users`
**Function:** Retrieves a list of all users in the system. Useful for administrative overview and user management.

**Required Roles:** `super_admin`, `admin`

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
**Function:** Retrieves detailed information about a specific user by their unique identifier.

**Required Roles:** Any authenticated user (can view own profile, admins can view any)

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: User UUID

**Response:** User object with full details

#### GET `/users/role/:role`
**Function:** Retrieves all users filtered by a specific role. Useful for finding all students, all drivers, etc.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `role`: One of the user roles (`super_admin`, `admin`, `transportation_supervisor`, `college_supervisor`, `bus_driver`, `student`)

**Response:** Array of user objects matching the specified role

#### PATCH `/users/:id`
**Function:** Updates user information such as name, email, and active status. Allows partial updates.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: User UUID

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
**Function:** Permanently deletes a user from the system. This is a destructive operation and should be used with caution.

**Required Roles:** `super_admin` (only)

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: User UUID

---

### 🏛️ Account Management

#### POST `/accounts`
**Function:** Creates a new account with user credentials. This endpoint supports creating accounts for different roles (admin, student, bus_driver) with role-specific fields. The account creation process validates passwords match and enforces role-based validation rules.

**Required Roles:** `super_admin`, `admin`

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
  "studentConfirmPassword": "password123",
  "collegeId": "college-uuid"
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
  "driverConfirmPassword": "password123",
  "driverLicenseNumber": "DL123456"
}
```

#### GET `/accounts`
**Function:** Retrieves all accounts in the system with their associated user information. Provides a comprehensive view of all registered accounts.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of account objects with user details

#### GET `/accounts/role/:role`
**Function:** Retrieves all accounts filtered by a specific role. Useful for role-based account management and filtering.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `role`: User role to filter by

**Response:** Array of account objects matching the role

#### GET `/accounts/:id`
**Function:** Retrieves detailed information about a specific account by its unique identifier.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Account UUID

**Response:** Account object with full details

#### PATCH `/accounts/:id`
**Function:** Updates account information including personal details, username, password, and other account-related fields. Supports partial updates.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Account UUID

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "username": "updated_username",
  "password": "newpassword123",
  "confirmPassword": "newpassword123",
  "phoneNumber": "+1234567890",
  "universityId": "STU002",
  "driverLicenseNumber": "DL789012"
}
```

#### DELETE `/accounts/:id`
**Function:** Soft deletes an account from the system. The account is marked as deleted but may retain data for audit purposes.

**Required Roles:** `super_admin` (only)

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Account UUID

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

---

### 🏫 College Management

#### POST `/colleges`
**Function:** Creates a new college entity in the system. Colleges represent academic divisions or departments within the university and are used to organize students and courses.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Engineering College",
  "description": "College of Engineering and Technology",
  "location": "Main Campus, Building A"
}
```

**Response:** Created college object with generated UUID

#### GET `/colleges`
**Function:** Retrieves a list of all colleges in the system. This endpoint is accessible to all authenticated users for browsing available colleges.

**Required Roles:** Any authenticated user

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
**Function:** Retrieves detailed information about a specific college by its unique identifier.

**Required Roles:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: College UUID

**Response:** College object with full details

#### PATCH `/colleges/:id`
**Function:** Updates college information such as name, description, location, and active status.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: College UUID

**Request Body:**
```json
{
  "name": "Updated College Name",
  "description": "Updated description",
  "location": "New Location",
  "isActive": true
}
```

#### DELETE `/colleges/:id`
**Function:** Permanently deletes a college from the system. Should be used with caution as it may affect associated students and courses.

**Required Roles:** `super_admin` (only)

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: College UUID

---

### 🚌 Bus Management

#### POST `/buses`
**Function:** Creates a new bus record in the system. Buses represent transportation vehicles used to transport students. Each bus can be assigned to a driver and routes.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

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

**Response:** Created bus object with generated UUID and initial location data

#### GET `/buses`
**Function:** Retrieves a list of all buses in the system, including their current status, location (if available), and assigned driver information.

**Required Roles:** Any authenticated user

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
**Function:** Retrieves detailed information about a specific bus, including its current location, assigned driver, routes, and operational status.

**Required Roles:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus UUID

**Response:** Bus object with full details

#### PATCH `/buses/:id`
**Function:** Updates bus information such as plate number, model, capacity, assigned driver, and active status.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus UUID

**Request Body:**
```json
{
  "plateNumber": "XYZ-789",
  "model": "Updated Model",
  "capacity": 30,
  "driverId": "new-driver-uuid",
  "isActive": true
}
```

#### DELETE `/buses/:id`
**Function:** Permanently removes a bus from the system. Use with caution as it may affect active routes and tracking data.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus UUID

#### PATCH `/buses/:id/location`
**Function:** Updates the real-time GPS location of a bus. This endpoint is used by bus drivers to report their current position during transit. Updates both the bus location and creates a tracking history entry.

**Required Roles:** `bus_driver` (only)

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus UUID

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:** Updated bus object with new location and timestamp

---

### 🛣️ Route Management

#### POST `/routes`
**Function:** Creates a new transportation route. Routes define paths that buses follow, including waypoints (stops), distance, and estimated duration. Routes can be assigned to buses via bus-route assignments.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

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

**Response:** Created route object with generated UUID

#### GET `/routes`
**Function:** Retrieves all routes in the system with their waypoints, distance, and operational status.

**Required Roles:** Any authenticated user

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
**Function:** Retrieves detailed information about a specific route, including all waypoints and associated bus assignments.

**Required Roles:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Route UUID

**Response:** Route object with full details

#### PATCH `/routes/:id`
**Function:** Updates route information including name, description, waypoints, distance, duration, and active status.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Route UUID

**Request Body:**
```json
{
  "name": "Updated Route Name",
  "description": "Updated description",
  "waypoints": [...],
  "distance": 20.0,
  "estimatedDuration": 40
}
```

#### DELETE `/routes/:id`
**Function:** Permanently deletes a route from the system. This will also remove any bus-route assignments associated with this route.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Route UUID

---

### 🔗 Bus Route Assignments

#### POST `/bus-routes`
**Function:** Creates a new assignment between a bus and a route. This links a specific bus to a route for scheduling and operational purposes. Allows defining when buses operate on specific routes.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "busId": "bus-uuid",
  "routeId": "route-uuid",
  "schedule": "MON-FRI 08:00-17:00",
  "isActive": true
}
```

**Response:** Created bus-route assignment object

#### GET `/bus-routes`
**Function:** Retrieves all bus-route assignments in the system, showing which buses are assigned to which routes.

**Required Roles:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of bus-route assignment objects with bus and route details

#### GET `/bus-routes/:id`
**Function:** Retrieves detailed information about a specific bus-route assignment.

**Required Roles:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus-route assignment UUID

**Response:** Bus-route assignment object with related bus and route information

#### PATCH `/bus-routes/:id`
**Function:** Updates a bus-route assignment, including schedule changes, active status, or reassignment to different buses/routes.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus-route assignment UUID

**Request Body:**
```json
{
  "busId": "new-bus-uuid",
  "routeId": "new-route-uuid",
  "schedule": "Updated schedule",
  "isActive": false
}
```

#### DELETE `/bus-routes/:id`
**Function:** Removes a bus-route assignment, effectively unassigning a bus from a route.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Bus-route assignment UUID

---

### 📍 Tracking & Location

#### POST `/tracking/bus/:busId/location`
**Function:** Records a new location update for a bus. This endpoint is called by bus drivers to continuously report their GPS position, speed, and heading. Creates a historical record of bus movements for tracking and analysis purposes.

**Required Roles:** `bus_driver` (only)

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `busId`: Bus UUID

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "heading": 180
}
```

**Response:** Location tracking record with timestamp

#### GET `/tracking/bus/:busId/history`
**Function:** Retrieves the complete location history for a specific bus. Returns all recorded GPS positions, speeds, and headings over time, useful for analyzing routes, travel patterns, and generating reports.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`, `student`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `busId`: Bus UUID

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
**Function:** Retrieves real-time location data for all buses that have recently reported their location. Provides a snapshot of all active buses currently in transit, useful for live tracking dashboards.

**Required Roles:** Any authenticated user

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

### 🤖 AI Services

#### POST `/ai/semester-plan`
**Function:** Generates an optimized semester course plan for a student using AI algorithms and an n8n workflow integration. The system considers prerequisites, credit requirements, course availability, and scheduling constraints to recommend an ideal course load. Falls back to rule-based planning if the AI service is unavailable.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`, `student`

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

**Environment Variables:**
- `N8N_SEMESTER_PLANNER_URL`: n8n webhook URL for AI planning service
- `AI_BALANCE_WEIGHT`: 0..1 balance weight (default 0.4)

#### POST `/ai/optimize-route`
**Function:** Uses AI algorithms to optimize a transportation route by finding the most efficient path through waypoints. Can reduce travel time and distance by reordering stops optimally.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "waypoints": [
    { "latitude": 40.7128, "longitude": -74.0060 },
    { "latitude": 40.7589, "longitude": -73.9851 },
    { "latitude": 40.7282, "longitude": -73.9942 }
  ]
}
```

**Response:** Optimized route with reordered waypoints and estimated improvements

#### POST `/ai/predict-arrival`
**Function:** Predicts the estimated arrival time for a bus at a destination using AI-based algorithms. Considers current location, route, traffic patterns, and historical data to provide accurate arrival estimates.

**Required Roles:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "busId": "bus-uuid",
  "routeId": "route-uuid",
  "currentLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Response:** Predicted arrival time with confidence score

#### POST `/ai/student-query`
**Function:** Processes natural language queries from students using an AI chatbot. Answers questions about courses, schedules, transportation, and other student-related information.

**Required Roles:** `student` (only)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "query": "What are the prerequisites for CS301?",
  "studentId": "student-uuid"
}
```

**Response:** AI-generated response to the student's query

#### POST `/ai/generate-insights`
**Function:** Generates analytical insights about transportation operations using AI analytics. Analyzes patterns in bus usage, route efficiency, arrival times, and other metrics over a specified time range.

**Required Roles:** `super_admin`, `admin`, `transportation_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "start": "2024-01-01T00:00:00.000Z",
  "end": "2024-01-31T23:59:59.999Z"
}
```

**Response:** Analytical insights with recommendations and statistics

#### POST `/ai/external-service`
**Function:** Integrates with external AI services for extended functionality. Provides a flexible interface to connect with third-party AI providers for additional features beyond the built-in capabilities.

**Required Roles:** `super_admin`, `admin`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "serviceType": "service-name",
  "data": { /* service-specific data */ }
}
```

**Response:** Response from the external AI service


### 📚 Academic - Courses

#### GET `/academic/courses`
**Function:** Retrieves a comprehensive list of all courses in the system. Includes course codes, names, credit hours, descriptions, and other academic details. Used for course catalog browsing and management.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of course objects with full details

#### POST `/academic/courses`
**Function:** Creates a new course in the academic catalog. Courses represent individual subjects that students can enroll in, with details such as code, name, credit hours, and prerequisites.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "CS101",
  "name": "Introduction to Computer Science",
  "creditHours": 3,
  "description": "Fundamental concepts of computer science",
  "collegeId": "college-uuid",
  "courseStatus": "ACTIVE"
}
```

**Response:** Created course object

#### PATCH `/academic/courses/:id`
**Function:** Updates course information including name, description, credit hours, status, and other academic properties.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Course UUID

**Request Body:**
```json
{
  "name": "Updated Course Name",
  "creditHours": 4,
  "description": "Updated description",
  "courseStatus": "ACTIVE"
}
```

#### DELETE `/academic/courses/:id`
**Function:** Permanently removes a course from the system. Should be used carefully as it may affect student records and study plans.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Course UUID

#### GET `/academic/courses/:id/prerequisites`
**Function:** Retrieves all prerequisite courses for a specific course. Shows which courses must be completed before a student can enroll in this course.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Course UUID

**Response:** Array of prerequisite course objects

#### POST `/academic/courses/:id/prerequisites`
**Function:** Sets or replaces all prerequisites for a course. This operation replaces any existing prerequisites with the provided list, so include all prerequisites in the request.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Course UUID

**Request Body:**
```json
{
  "prereqCourseIds": ["prereq-course-uuid-1", "prereq-course-uuid-2"]
}
```

**Response:** Updated course with new prerequisites

#### GET `/academic/courses/export/csv`
**Function:** Exports all courses in the system to a CSV file format. Useful for bulk operations, backups, or importing into external systems.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Response:** CSV file download with all course data

#### POST `/academic/courses/import/csv`
**Function:** Imports courses from a CSV file. Allows bulk creation or update of courses from a formatted CSV string. The CSV must follow the system's template format.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "csv": "code,name,creditHours,description\nCS101,Intro to CS,3,Description..."
}
```

**Response:** Import results with created/updated courses count

---

### 📋 Academic - Study Plans

#### POST `/academic/study-plans`
**Function:** Creates a new study plan with optional course requirements. Study plans define the curriculum structure for a program, including required courses, credit hour requirements by category (buckets), and academic rules.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Computer Science Bachelor's Plan",
  "description": "4-year computer science program",
  "collegeId": "college-uuid",
  "courseRequirements": [
    {
      "courseId": "course-uuid",
      "isRequired": true,
      "bucket": "CORE"
    }
  ]
}
```

**Response:** Created study plan object

#### GET `/academic/study-plans`
**Function:** Retrieves all study plans in the system. Provides an overview of all academic programs and their requirements.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of study plan objects

#### GET `/academic/study-plans/:id`
**Function:** Retrieves detailed information about a specific study plan, including all course requirements and academic rules.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Study plan UUID

**Response:** Study plan object with full details

#### PATCH `/academic/study-plans/:id`
**Function:** Updates a study plan, including modifications to course requirements, credit hour allocations, and other academic rules.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Study plan UUID

**Request Body:**
```json
{
  "name": "Updated Plan Name",
  "description": "Updated description",
  "courseRequirements": [...]
}
```

#### DELETE `/academic/study-plans/:id`
**Function:** Permanently deletes a study plan from the system. Use with caution as this affects students enrolled in programs using this plan.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Study plan UUID

#### GET `/academic/study-plans/:id/totals`
**Function:** Computes and returns credit hour totals by category (bucket) for a study plan. Shows breakdown of required credits across different course categories (e.g., core courses, electives, general education).

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Study plan UUID

**Response:**
```json
{
  "CORE": 60,
  "ELECTIVE": 30,
  "GENERAL_ED": 30,
  "total": 120
}
```

---

### 📅 Academic - Schedule Management

#### POST `/academic/schedule/days`
**Function:** Creates a semester day definition (MON through SUN). Semester days define which days of the week are active for a specific semester, enabling flexible semester scheduling.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "semesterId": "semester-uuid",
  "dayOfWeek": "MON",
  "isActive": true
}
```

**Response:** Created semester day object

#### GET `/academic/schedule/days`
**Function:** Lists all semester days, optionally filtered by semester ID. Shows which days are scheduled for each semester.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `semesterId` (optional): Filter by specific semester

**Response:** Array of semester day objects

#### PATCH `/academic/schedule/days/:id`
**Function:** Updates a semester day, such as changing its active status or associated semester.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Semester day UUID

**Request Body:**
```json
{
  "isActive": false,
  "dayOfWeek": "TUE"
}
```

#### DELETE `/academic/schedule/days/:id`
**Function:** Deletes a semester day. This operation cascades to delete all scheduled sections associated with this day.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Semester day UUID

#### POST `/academic/schedule/sections`
**Function:** Creates a scheduled section for a course on a specific semester day. Defines when and where a course section meets, including time slots and section type (theory, lab, etc.).

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "semesterDayId": "semester-day-uuid",
  "courseId": "course-uuid",
  "sectionType": "THEORY",
  "timeSlots": ["P1", "P2"],
  "location": "Building A, Room 101"
}
```

**Response:** Created scheduled section object

#### GET `/academic/schedule/days/:semesterDayId/sections`
**Function:** Retrieves all scheduled sections for a specific semester day. Shows all course sections that meet on a particular day.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `semesterDayId`: Semester day UUID

**Response:** Array of scheduled section objects

#### PATCH `/academic/schedule/sections/:id`
**Function:** Updates a scheduled section, including time slots, location, section type, and other scheduling details.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Scheduled section UUID

**Request Body:**
```json
{
  "timeSlots": ["P3", "P4"],
  "location": "Building B, Room 205",
  "sectionType": "LAB"
}
```

#### DELETE `/academic/schedule/sections/:id`
**Function:** Deletes a scheduled section, removing it from the semester schedule.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id`: Scheduled section UUID

---

### ✅ Academic - Prerequisites Validation

#### GET `/academic/prereqs/validate`
**Function:** Validates the prerequisite graph across all courses to detect cycles and logical errors. Prerequisite cycles (e.g., Course A requires Course B, which requires Course A) would make it impossible for students to complete either course. This endpoint helps maintain data integrity.

**Required Roles:** `super_admin`, `admin`, `college_supervisor`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "valid": true,
  "cycles": [],
  "orphanedCourses": [],
  "message": "Prerequisite graph is valid"
}
```

If cycles are found:
```json
{
  "valid": false,
  "cycles": [
    ["CS301", "CS302", "CS301"]
  ],
  "orphanedCourses": [],
  "message": "Prerequisite cycles detected"
}
```

---

### 📱 Mobile

#### GET `/mobile/me/summary`
**Function:** Retrieves a comprehensive summary of the authenticated student's academic and transportation status. Designed for mobile applications, this endpoint provides all essential information in a single call, including personal info, bus registration status, GPA history, and course enrollment.

**Required Roles:** `student` (only)

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
