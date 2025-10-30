## Mobile Integration Guide

This guide provides what a mobile developer (Android/iOS/Flutter/React Native) needs to connect to the backend API.

### Base URLs
- Local API base (emulator): `http://10.0.2.2:3000` (Android emulator) or `http://localhost:3000` (iOS simulator)
- Device on same LAN: `http://<your-computer-ip>:3000`
- Swagger docs: `http://<base>/api`

### Auth (JWT)
- Login:
```http
POST /auth/login
Content-Type: application/json

{ "username": "driver1", "password": "pass" }
```
- Use the returned `access_token` in header `Authorization: Bearer <token>`.
- Persist token securely (Keychain/Keystore/SecureStorage).

### Required Headers
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

### Network tips
- Enable CORS on backend (already configured). For devices, ensure your phone and dev machine are on the same network.
- For self-signed certs in dev, prefer HTTP locally.

### Core APIs used by mobile apps
- Auth: `/auth/login`, `/auth/register`
- Tracking (drivers/students):
  - Update bus location: `POST /tracking/bus/:busId/location`
  - Get active buses: `GET /tracking/buses/active`
  - Get bus history: `GET /tracking/bus/:busId/history`
- Transportation: `/buses`, `/routes` as needed by role
- Academic (read-only for students):
  - Courses, study plans: `/academic/courses`, `/academic/study-plans`

### Example code (TypeScript/React Native)
```ts
const API = 'http://10.0.2.2:3000';

export async function login(username: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  return data.access_token as string;
}
```

### Realtime (Socket.io)
- URL: `ws://<base>`
- Sample (JS):
```ts
import { io } from 'socket.io-client';
const socket = io(API, { extraHeaders: { Authorization: `Bearer ${token}` } });
```

### Environment configuration
- Android emulator uses `10.0.2.2` to reach host machine.
- iOS simulator can use `http://localhost`.
- On device, use your machine IP.

### Roles
- Driver: updates bus location, views assigned routes.
- Student: views schedules, tracks buses, reads curriculum.
- Supervisor/Admin: may use mobile for approvals and quick actions.

For full endpoint details, consult `backend/API_DOCUMENTATION.md` and Swagger at runtime.

---

## API Reference (Essential for Mobile)

All requests include `Authorization: Bearer <token>` unless noted.

### Auth
- POST `/auth/login` — obtain JWT
- POST `/auth/register` — optional, if app supports sign-up

### Tracking (driver/student)
- POST `/tracking/bus/:busId/location` — driver sends GPS updates
- GET `/tracking/bus/:busId/history` — location history for a bus
- GET `/tracking/buses/active` — list of active buses and last coordinates

### Transportation
- GET `/buses` — list buses (role-based visibility)
- GET `/buses/:id` — bus details
- GET `/routes` — list routes
- GET `/routes/:id` — route details

### Academic (read-only common in mobile)
- GET `/academic/courses` — list courses
- GET `/academic/study-plans` — list study plans for browsing
- GET `/academic/study-plans/:id` — plan details

### Supervisor/Admin (if mobile supports management)
- POST `/academic/courses` — create course
- PATCH `/academic/courses/:id` — update course
- DELETE `/academic/courses/:id` — delete course
- GET `/academic/courses/:id/prerequisites` — list prereqs
- POST `/academic/courses/:id/prerequisites` — set prereqs
- GET `/academic/prereqs/validate` — validate prereq cycles

### Socket.io channels (optional)
- Connect to `ws://<base>`; use auth header if required.

### Common status codes
- 200/201 success, 400 invalid body, 401 unauthorized, 403 forbidden, 404 not found