import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roles = [] }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // kalau roles kosong => semua role boleh
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
