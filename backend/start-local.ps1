$env:DB_HOST = "localhost"
$env:DB_PORT = "5434"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "postgres"
$env:DB_NAME = "student_assistant"
$env:JWT_SECRET = "your-secret-key-change-in-production"
$env:JWT_EXPIRES_IN = "24h"
$env:NODE_ENV = "development"
$env:PORT = "3000"
$env:CORS_ORIGIN = "http://localhost:4200,http://localhost:3000"

npm run start:dev

