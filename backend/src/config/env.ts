// src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Add this line for debugging


export const env = {
  port: process.env.PORT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT
};
