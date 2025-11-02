# Student Assistant Frontend

Angular 18 frontend application for the Student Assistant system.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

## Development Setup

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Docker Setup

### Build and Run with Docker Compose

From the project root directory:

```bash
docker-compose up --build frontend
```

Or to start all services (database, backend, frontend):

```bash
docker-compose up --build
```

The frontend will be available at `http://localhost:4200`

### Build Docker Image Only

```bash
docker build -t student-assistant-frontend .
```

### Run Docker Container

```bash
docker run -p 4200:80 student-assistant-frontend
```

## Features

- **Authentication**: Login with username/University ID and password
- **JWT Token Management**: Automatic token storage and injection
- **Route Guards**: Protected routes requiring authentication
- **Material Design**: Modern UI with Angular Material
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── login/          # Login component
│   │   ├── home/               # Home component
│   │   ├── core/
│   │   │   ├── guards/        # Route guards
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   └── services/      # Core services (auth, etc.)
│   │   ├── app.component.*
│   │   ├── app.config.ts      # App configuration
│   │   └── app.routes.ts       # Routing configuration
│   ├── environments/           # Environment configuration
│   └── styles.scss            # Global styles
├── Dockerfile
├── nginx.conf
└── package.json
```

## API Configuration

The API base URL is configured in `src/environments/environment.ts`. Default is `http://localhost:3000`.

For production, update `src/environments/environment.prod.ts` with your production API URL.

## Build for Production

```bash
npm run build
```

The production build will be in `dist/frontend/` directory.

## Testing

```bash
npm test
```
