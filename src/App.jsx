import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";
import { useAuth } from "./auth/AuthContext.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import EmployeeLayout from "./layouts/EmployeeLayout.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";

function roleHome(role) {
  // Theo spec Word: ADMIN -> /admin/dashboard, USER -> /user/dashboard
  return role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
}

function HomeRedirect() {
  const { isInitializing, isAuthenticated, user } = useAuth();

  if (isInitializing) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Navigate to={roleHome(user?.role)} replace />;
}

function Placeholder({ title }) {
  return (
    <div style={{ padding: 12 }}>
      <h2>{title}</h2>
      <p>Trang placeholder (GĐ2). Bạn có thể triển khai chi tiết ở các giai đoạn sau.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/403" element={<Forbidden />} />

      {/* ADMIN AREA */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Placeholder title="Quản lý nhân viên" />} />
        <Route path="timesheet" element={<Placeholder title="Duyệt công / Timesheet" />} />
        <Route path="reports" element={<Placeholder title="Báo cáo" />} />
        <Route path="settings" element={<Placeholder title="Cấu hình" />} />
        <Route path="tasks" element={<Placeholder title="Giao việc" />} />
        <Route path="meetings" element={<Placeholder title="Lịch họp" />} />
      </Route>

      {/* USER/EMPLOYEE AREA */}
      <Route
        path="/user"
        element={
          <RequireAuth allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}>
            <EmployeeLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<Placeholder title="Hồ sơ" />} />
        <Route path="attendance" element={<Placeholder title="Chấm công" />} />
        <Route path="payroll" element={<Placeholder title="Bảng lương" />} />
        <Route path="trello" element={<Placeholder title="Trello" />} />
        <Route path="meetings" element={<Placeholder title="Lịch họp / Deadline" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
