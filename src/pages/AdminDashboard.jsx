import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <p>Xin chào, {user?.name || user?.id || "ADMIN"}.</p>
      <p>Role: {user?.role}</p>

      <button
        className="btn-primary"
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
}
