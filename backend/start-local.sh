#!/bin/bash
export DB_HOST=localhost
export DB_PORT=5434
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_NAME=student_assistant
export JWT_SECRET=your-secret-key-change-in-production
export JWT_EXPIRES_IN=24h
export NODE_ENV=development
export PORT=3000
export CORS_ORIGIN=http://localhost:4200,http://localhost:3000

npm run start:dev

