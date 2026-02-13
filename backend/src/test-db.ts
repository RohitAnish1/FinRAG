// filepath: c:\PROJECTS\FinRAG\backend\src\test-db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
pool.connect()
  .then(() => {
    console.log('Connected to the database successfully');
    pool.end();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });