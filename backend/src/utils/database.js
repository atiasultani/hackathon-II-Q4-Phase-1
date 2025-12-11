const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todo_db',
  password: process.env.DB_PASS || 'postgres',
  port: process.env.DB_PORT || 5432,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Generic query function to execute SQL queries
const query = (text, params) => {
  return pool.query(text, params);
};

// Export the pool and query function
module.exports = {
  query,
  pool
};