import { createContext, useState, createElement, useEffect } from "react";
import type { ReactNode } from "react";
import * as authApi from "../api/auth.api";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------
     Rehydrate auth state from localStorage on app load
     ------------------------------------------------------------------ */
  useEffect(() => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return;

  try {
    const base64 = token.split(".")[1];
    if (!base64) return;

    const payload = JSON.parse(atob(base64));

    if (!payload?.userId) return;

    setUser({
      id: payload.userId,
      email: ""
    });
  } catch (err) {
    console.error("JWT rehydration failed:", err);
    // DO NOT remove token here
  }
}, []);


  /* ------------------------------------------------------------------
     Login
     ------------------------------------------------------------------ */
 const login = async (email: string, password: string): Promise<void> => {
  setLoading(true);
  setError(null);

  try {
    const data = await authApi.login(email, password);

    localStorage.setItem("jwtToken", data.token);

    console.log(
      "TOKEN AFTER SAVE:",
      localStorage.getItem("jwtToken")
    );

    setUser(data.user);
  } catch (err: any) {
    setError(err?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  /* ------------------------------------------------------------------
     Register
     ------------------------------------------------------------------ */
  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.register(email, password);
      setUser(data.user);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------
     Logout
     ------------------------------------------------------------------ */
  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, login, register, logout, loading, error } },
    children
  );
}
