import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f6f7fb" }}>
      <h2>403 - Forbidden</h2>
      <p>Bạn không có quyền truy cập trang này.</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}
