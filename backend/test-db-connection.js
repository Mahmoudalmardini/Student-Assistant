const { Client } = require('pg');
require('dotenv').config();

console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'student_assistant',
});

console.log('Connecting with:', {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'student_assistant',
});

client.connect()
  .then(() => {
    console.log('✅ Database connection successful!');
    return client.query('SELECT version()');
  })
  .then((result) => {
    console.log('Database version:', result.rows[0].version);
    client.end();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    client.end();
  });
