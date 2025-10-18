export default () => ({
  port: parseInt(process.env.ACCOUNTS_PORT, 10) || 3001,
  accountsPort: parseInt(process.env.ACCOUNTS_PORT, 10) || 3001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/student-assistant',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  
  // Static Super Admin Credentials
  superAdmin: {
    username: 'admin',
    password: 'admin123',
    email: 'admin@student-assistant.com',
  },
});

