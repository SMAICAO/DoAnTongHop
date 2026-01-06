import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function RequireAuth({ allowedRoles = [], children }) {
  const { isInitializing, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isInitializing) return <div className="app-center">Loading...</div>;

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
