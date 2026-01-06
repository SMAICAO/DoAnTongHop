import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import "../styles/login.css";

function roleHome(role) {
  return role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
}

function canGoFrom(role, fromPath) {
  if (!fromPath || typeof fromPath !== "string") return false;
  if (role === "ADMIN") return fromPath.startsWith("/admin");
  return fromPath.startsWith("/user");
}

function normalizeError(err) {
  const status = err?.response?.status;

  if (status === 401) return "Thông tin đăng nhập không đúng.";
  if (status === 423) return "Tài khoản đã bị khóa. Liên hệ Admin.";
  if (status === 429) return "Bạn thao tác quá nhanh. Vui lòng thử lại.";
  if (status >= 500) return "Lỗi hệ thống. Vui lòng thử lại.";

  if (!err?.response) return "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.";
  return "Đăng nhập thất bại. Vui lòng thử lại.";
}

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(roleHome(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  function validate() {
    if (!identifier.trim()) return "Vui lòng nhập Email/Username.";
    if (!password) return "Vui lòng nhập mật khẩu.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const v = validate();
    if (v) return setErrorMsg(v);

    setLoading(true);
    try {
      const u = await login({ identifier: identifier.trim(), password });

      const from = location.state?.from;
      if (canGoFrom(u.role, from)) return navigate(from, { replace: true });

      navigate(roleHome(u.role), { replace: true });
    } catch (err) {
      setErrorMsg(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Đăng nhập</h1>

        {errorMsg ? <div className="error-box">{errorMsg}</div> : null}

        <form onSubmit={onSubmit} className="login-form">
          <label className="field">
            <span className="label">Email/Username</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="vd: tuan@gmail.com hoặc tuan123"
              autoComplete="username"
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="label">Mật khẩu</span>
            <div className="password-wrap">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowPass((s) => !s)}
                disabled={loading}
              >
                {showPass ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </label>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="hint">
            Backend tối thiểu: <code>POST /auth/login</code> + <code>GET /auth/me</code>
          </div>
        </form>
      </div>
    </div>
  );
}
