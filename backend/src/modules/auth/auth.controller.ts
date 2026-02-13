import { Request, Response } from "express";
import { createUser, authenticateUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const user = await createUser({ email, password, fullName });
    res.status(201).json({ user });
  } catch (err: any) {
    if (err.code === "23505") {
      // unique_violation
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const result = await authenticateUser(email, password);
    res.json(result);
  } catch {
    res.status(401).json({ message: "Invalid email or password" });
  }
}
