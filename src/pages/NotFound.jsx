import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <h2>404 - Not Found</h2>
      <p>Trang không tồn tại.</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}
