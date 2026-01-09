import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";
import { useAuth } from "./auth/AuthContext.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminCalendar from "./pages/admin/AdminCalendar.jsx";
import AdminTasks from "./pages/admin/AdminTasks.jsx";
import AdminTimesheet from "./pages/admin/AdminTimesheet.jsx";
import AdminEmployees from "./pages/admin/AdminEmployees.jsx";

import EmployeeLayout from "./layouts/EmployeeLayout.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import UserAttendance from "./pages/user/UserAttendance.jsx";
import UserMeetings from "./pages/user/UserMeetings.jsx";
import EmployeeForm from "./pages/user/Employee form/EmployeeForm.jsx";
import Homepage from "./pages/user/Homepage/Homepage.jsx";

import "./App.css"

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
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="timesheet" element={<AdminTimesheet />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="calendar" element={<AdminCalendar />} />
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
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/edit" element={<EmployeeForm />} />
        <Route path="attendance" element={<UserAttendance />} />
        <Route path="tasks" element={<Homepage />} />
        <Route path="meetings" element={<UserMeetings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
