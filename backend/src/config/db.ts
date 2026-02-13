import { Pool, QueryResult, QueryResultRow } from 'pg';
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Add this line for debugging

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

export const query = <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => pool.query(text, params);

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch(err => console.error('PostgreSQL connection error:', err));