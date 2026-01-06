import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import "./layout.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">ADMIN</div>

        <div className="sidebar__user">
          <div className="sidebar__name">{user?.name || "Admin"}</div>
          <div className="sidebar__role">{user?.role}</div>
        </div>

        <nav className="sidebar__nav">
          <NavLink to="/admin/dashboard" className="navitem">
            Dashboard
          </NavLink>
          <NavLink to="/admin/employees" className="navitem">
            Quản lý nhân viên
          </NavLink>
          <NavLink to="/admin/timesheet" className="navitem">
            Duyệt công / Timesheet
          </NavLink>
          <NavLink to="/admin/reports" className="navitem">
            Báo cáo
          </NavLink>
          <NavLink to="/admin/settings" className="navitem">
            Cấu hình
          </NavLink>
          <NavLink to="/admin/tasks" className="navitem">
            Giao việc
          </NavLink>
          <NavLink to="/admin/meetings" className="navitem">
            Lịch họp
          </NavLink>
        </nav>

        <button
          className="sidebar__logout"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Logout
        </button>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
