import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuth, getStoredAuth, persistAuth } from "./storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Bootstrap khi F5: đọc localStorage để giữ phiên
  useEffect(() => {
    try {
      const stored = getStoredAuth();
      if (stored?.access_token && stored?.user) {
        setToken(stored.access_token);
        setUser(stored.user);
      }
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // MOCK login: không gọi backend
  async function login({ identifier, password }) {
    // giả lập delay mạng
    await new Promise((r) => setTimeout(r, 450));

    // 2 tài khoản demo
    const ok =
      (identifier === "admin" && password === "123") ||
      (identifier === "user" && password === "123");

    if (!ok) {
      const err = new Error("Unauthorized");
      err.response = { status: 401 };
      throw err;
    }

    const isAdmin = identifier === "admin";
    const u = {
      id: isAdmin ? "a1" : "u1",
      name: isAdmin ? "Admin Demo" : "User Demo",
      role: isAdmin ? "ADMIN" : "USER",
    };

    const access_token = isAdmin ? "mock_admin_token" : "mock_user_token";

    persistAuth({ access_token, user: u });
    setToken(access_token);
    setUser(u);
    return u;
  }

  function logout() {
    clearAuth();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated, isInitializing, login, logout }),
    [user, token, isAuthenticated, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
