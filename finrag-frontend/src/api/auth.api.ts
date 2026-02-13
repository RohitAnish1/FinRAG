import { apiClient } from "./client";

export async function login(email: string, password: string) {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
}

export async function register(email: string, password: string) {
  const res = await apiClient.post("/auth/register", { email, password });
  return res.data;
}


