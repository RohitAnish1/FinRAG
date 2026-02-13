import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Authorization Header:", authHeader); // Debug log
  console.log("Extracted Token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    console.log("Decoded Payload:", payload); // Debug log
    req.user = { id: payload.userId }; // Attach user ID to the request object
    next();
  } catch (err) {
    console.error("Token verification failed:", err); // Debug log
    return res.status(403).json({ message: "Forbidden" });
  }
}