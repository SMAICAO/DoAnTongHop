import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import "./layout.css";

export default function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">E963</div>

        <div className="sidebar__user">
          <div className="sidebar__name">{user?.name || "Employee"}</div>
          <div className="sidebar__role">{user?.role}</div>
        </div>

        <nav className="sidebar__nav">
          <NavLink to="/user/dashboard" className="navitem">
            Dashboard
          </NavLink>
          <NavLink to="/user/profile" className="navitem">
            Hồ sơ
          </NavLink>
          <NavLink to="/user/attendance" className="navitem">
            Chấm công
          </NavLink>
          <NavLink to="/user/payroll" className="navitem">
            Bảng lương
          </NavLink>
          <NavLink to="/user/trello" className="navitem">
            Trello
          </NavLink>
          <NavLink to="/user/meetings" className="navitem">
            Lịch họp / Deadline
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
