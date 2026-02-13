"use client"

import type React from "react"
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Redirect to /auth if the user is not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}
