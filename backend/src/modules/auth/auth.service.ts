import { pool } from '../../config/db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

interface CreateUserInput {
  email: string;
  password: string;
  fullName?: string;
}

export async function createUser(input: CreateUserInput) {
  const { email, password, fullName } = input;

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `
      INSERT INTO users (email, password_hash, full_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, full_name
      `,
      [email, passwordHash, fullName]
    );

    const user = userRes.rows[0];

    // create empty portfolio for user
    await client.query(
      `
      INSERT INTO portfolios (user_id, cash_balance)
      VALUES ($1, 100000)
      `,
      [user.id]
    );

    await client.query("COMMIT");
    return user;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function authenticateUser(email: string, password: string) {
  const res = await pool.query(
    `
    SELECT id, email, password_hash, full_name
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (res.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const user = res.rows[0];

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    },
  };
}
