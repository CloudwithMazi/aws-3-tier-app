const mysql = require('mysql2/promise');

// Load connection info from environment variables (set them in ECS or Docker)
const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'mydb',
} = process.env;

// Create a connection pool (better for handling multiple requests)
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  connectionLimit: 5, // Adjust as needed
});

module.exports = pool;
