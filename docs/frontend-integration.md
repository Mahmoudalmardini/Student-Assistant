## Frontend Integration Guide

This guide provides everything a web frontend developer needs to connect to the backend API.

### Base URLs
- Local API base: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api`

### Auth
- JWT Bearer in `Authorization` header.
- Login:
```http
POST /auth/login
Content-Type: application/json

{ "username": "admin", "password": "admin123" }
```
- Response contains `access_token`. Send with all requests:
```
Authorization: Bearer <token>
```

### CORS
Allow `http://localhost:4200` (Angular) or your dev origin. Configure via `CORS_ORIGIN` env.

### Common Headers
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

### Error Shape
```json
{ "statusCode": 400, "message": "Bad Request", "error": "..." }
```

### Key API Groups (web needs)
- Auth: `/auth/login`, `/auth/register`
- Users: `/users`, `/users/:id`, role filtering `/users/role/:role`
- Academic:
  - Courses CRUD: `/academic/courses`
  - Set/list prerequisites: `/academic/courses/:id/prerequisites`
  - CSV: `GET /academic/courses/export/csv`, `POST /academic/courses/import/csv`
  - Study plans: `/academic/study-plans` and `/academic/study-plans/:id/totals`
  - Prereq graph validation: `GET /academic/prereqs/validate`
- Transportation:
  - `/buses`, `/routes`, and tracking `/tracking/*`

### Example: fetch courses
```ts
const res = await fetch(`${API}/academic/courses`, {
  headers: { Authorization: `Bearer ${token}` },
});
const courses = await res.json();
```

### File Uploads
If needed, use `multipart/form-data` per specific endpoints.

### Realtime (optional)
- Socket.io at `ws://localhost:3000` for tracking events.

### Environments
Set in your frontend `.env`:
```
VITE_API_BASE=http://localhost:3000
```

### Role Matrix (high level)
- Supervisor: can manage curriculum (courses, plans, prerequisites).
- Admin: broad management.
- Student: read-only academic and tracking views.

For full endpoint details see `backend/API_DOCUMENTATION.md` and Swagger at runtime.

---

## API Reference (Essential for Frontend)

Below are the primary REST endpoints the web app typically calls. All require `Authorization: Bearer <token>` unless noted.

### Auth
- POST `/auth/login` — obtain JWT
- POST `/auth/register` — optional (if UI supports sign-up)

### Users
- GET `/users` — list users (admin)
- GET `/users/:id` — user by ID
- GET `/users/role/:role` — filter by role (`STUDENT`, `COLLEGE_SUPERVISOR`, `ADMIN`, ...)
- PATCH `/users/:id` — update user (admin)
- DELETE `/users/:id` — delete (super admin)

### Academic — Curriculum & Study Plans
- GET `/academic/courses` — list courses
- POST `/academic/courses` — create (supervisor)
- PATCH `/academic/courses/:id` — update (supervisor)
- DELETE `/academic/courses/:id` — delete (supervisor)
- GET `/academic/courses/:id/prerequisites` — list prerequisites
- POST `/academic/courses/:id/prerequisites` — set prerequisites (replace all)
- GET `/academic/courses/export/csv` — export all courses as CSV
- POST `/academic/courses/import/csv` — import CSV body `{ csv: string }`
- GET `/academic/study-plans` — list study plans
- POST `/academic/study-plans` — create plan (supervisor/admin)
- GET `/academic/study-plans/:id` — get plan
- PATCH `/academic/study-plans/:id` — update plan
- DELETE `/academic/study-plans/:id` — delete plan
- GET `/academic/study-plans/:id/totals` — totals per bucket
- GET `/academic/prereqs/validate` — detect prerequisite cycles

### Transportation
- GET `/buses` — list buses
- POST `/buses` — create (admin/transportation supervisor)
- GET `/buses/:id` — bus details
- PATCH `/buses/:id` — update
- DELETE `/buses/:id` — delete (admin)
- GET `/routes` — list routes
- POST `/routes` — create route
- GET `/routes/:id` — get route
- PATCH `/routes/:id` — update route
- DELETE `/routes/:id` — delete route

### Tracking (Realtime companion: Socket.io)
- POST `/tracking/bus/:busId/location` — update location (driver)
- GET `/tracking/bus/:busId/history` — location history
- GET `/tracking/buses/active` — active buses with last known location

### Common Query/Path params
- Pagination (if exposed): `?page=1&limit=20`
- Filtering examples: `/users/role/STUDENT`, `/routes?active=true`

### Common HTTP status codes
- 200/201 success, 400 validation error, 401 unauthorized, 403 forbidden, 404 not found