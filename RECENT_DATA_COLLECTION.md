# Recent Documentation: Mobile Student Summary & Data Collection

## Overview
This document summarizes the recently added Mobile Student Summary feature, the data collected/returned by the endpoint, and includes dummy data examples.

## Endpoint
- Method: `GET`
- Path: `/mobile/me/summary`
- Auth: `Bearer <JWT>`
- Role: `student`

## Data Collected and Returned
- `name` (string): Student full name from `users`.
- `busRegistered` (boolean): Whether the student has an active bus registration.
- `cumulativeGpa` (object): Overall GPA on a 4.0 scale and classification.
  - `value` (number)
  - `classification` ("poor" | "average" | "good" | "very good" | "excellent")
- `semesterGpas` (array): GPA per semester with classification.
  - `semesterId`, `semesterName`, `value`, `classification`
- `courses` (array): Student’s courses with grade details and status.
  - `courseId`, `code`, `name`, `creditHours`, `semesterId`, `semesterName`, `gradeNumeric` (0–100), `gradePoint` (0–4), `status` ("Pass" | "Conditional" | "Fail")

## Classification Rules
- GPA classification (4.0 scale):
  - 0–1.99: poor
  - 2–2.5: average
  - 2.51–3: good
  - 3.1–3.5: very good
  - 3.51–4: excellent
- Course status by numeric grade:
  - ≥60: Pass
  - 50–59: Conditional
  - <50: Fail

---

## Dummy Data (Reference)
Below dummy records illustrate how the system entities relate. These are examples and not automatically seeded into the database.

### Users
```json
[
  {
    "id": "stu-001",
    "firstName": "Sara",
    "lastName": "Youssef",
    "role": "student",
    "universityId": "U-2024001"
  },
  {
    "id": "stu-002",
    "firstName": "Khaled",
    "lastName": "Hassan",
    "role": "student",
    "universityId": "U-2024002"
  }
]
```

### Transportation
- Bus
```json
{
  "id": "bus-101",
  "plateNumber": "ABC-123",
  "model": "Mercedes Sprinter",
  "capacity": 25
}
```
- Route
```json
{
  "id": "route-1",
  "name": "Campus ⇄ Downtown",
  "distance": 15.5,
  "estimatedDuration": 30
}
```
- Bus Registration (active)
```json
[
  { "id": "br-1", "userId": "stu-001", "busId": "bus-101", "routeId": "route-1", "isActive": true },
  { "id": "br-2", "userId": "stu-002", "busId": null, "routeId": null, "isActive": false }
]
```

### Academic
- Semesters
```json
[
  { "id": "sem-fall", "name": "2024-2025 Fall", "startDate": "2024-09-01", "endDate": "2025-01-15" },
  { "id": "sem-spring", "name": "2024-2025 Spring", "startDate": "2025-02-01", "endDate": "2025-06-15" }
]
```
- Courses
```json
[
  { "id": "c-math101", "code": "MATH101", "name": "Calculus I", "creditHours": 3 },
  { "id": "c-phy101", "code": "PHY101", "name": "Physics I", "creditHours": 4 },
  { "id": "c-cs101", "code": "CS101", "name": "Intro to CS", "creditHours": 3 }
]
```
- Enrollments (include cached gradePoint)
```json
[
  { "id": "e-1", "userId": "stu-001", "courseId": "c-math101", "semesterId": "sem-fall", "gradeNumeric": 88, "gradePoint": 3.7 },
  { "id": "e-2", "userId": "stu-001", "courseId": "c-phy101", "semesterId": "sem-fall", "gradeNumeric": 62, "gradePoint": 2.0 },
  { "id": "e-3", "userId": "stu-001", "courseId": "c-cs101", "semesterId": "sem-spring", "gradeNumeric": 54, "gradePoint": 1.3 },
  { "id": "e-4", "userId": "stu-002", "courseId": "c-math101", "semesterId": "sem-fall", "gradeNumeric": 77, "gradePoint": 3.0 }
]
```

---

## Sample Responses

### Student with active bus registration (stu-001)
```json
{
  "name": "Sara Youssef",
  "busRegistered": true,
  "cumulativeGpa": { "value": 2.71, "classification": "good" },
  "semesterGpas": [
    { "semesterId": "sem-fall", "semesterName": "2024-2025 Fall", "value": 2.86, "classification": "good" },
    { "semesterId": "sem-spring", "semesterName": "2024-2025 Spring", "value": 1.3, "classification": "poor" }
  ],
  "courses": [
    {
      "courseId": "c-math101",
      "code": "MATH101",
      "name": "Calculus I",
      "creditHours": 3,
      "semesterId": "sem-fall",
      "semesterName": "2024-2025 Fall",
      "gradeNumeric": 88,
      "gradePoint": 3.7,
      "status": "Pass"
    },
    {
      "courseId": "c-phy101",
      "code": "PHY101",
      "name": "Physics I",
      "creditHours": 4,
      "semesterId": "sem-fall",
      "semesterName": "2024-2025 Fall",
      "gradeNumeric": 62,
      "gradePoint": 2.0,
      "status": "Pass"
    },
    {
      "courseId": "c-cs101",
      "code": "CS101",
      "name": "Intro to CS",
      "creditHours": 3,
      "semesterId": "sem-spring",
      "semesterName": "2024-2025 Spring",
      "gradeNumeric": 54,
      "gradePoint": 1.3,
      "status": "Conditional"
    }
  ]
}
```

### Student without active bus registration (stu-002)
```json
{
  "name": "Khaled Hassan",
  "busRegistered": false,
  "cumulativeGpa": { "value": 3.0, "classification": "good" },
  "semesterGpas": [
    { "semesterId": "sem-fall", "semesterName": "2024-2025 Fall", "value": 3.0, "classification": "good" }
  ],
  "courses": [
    {
      "courseId": "c-math101",
      "code": "MATH101",
      "name": "Calculus I",
      "creditHours": 3,
      "semesterId": "sem-fall",
      "semesterName": "2024-2025 Fall",
      "gradeNumeric": 77,
      "gradePoint": 3.0,
      "status": "Pass"
    }
  ]
}
```

---

## Notes
- The endpoint is read-only and aggregates from users, enrollment, course, semester, and active bus registration.
- GPA calculations are weighted by course credit hours; values are rounded to 2 decimals.
- Course status uses numeric grade thresholds (≥60 Pass, 50–59 Conditional, <50 Fail).

---

## Prompt Reference

The mobile section should display for each student:

- Name
- Registered for university buses (registered or not)
- Cumulative GPA and semester GPAs with classification
  - GPA is on a 4 scale
  - Classification:
    - 0–1.99: poor
    - 2–2.5: average
    - 2.51–3: good
    - 3.1–3.5: very good
    - 3.51–4: excellent
- Student's courses with their classification (Pass, Fail, or Conditionally Pass)
  - Conditional passing occurs when the student's grade is between 50 and 59