import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { EMPLOYEES } from "../../data/mockData";

export default function UserProfile() {
  const { user } = useAuth();
  // Lấy data user từ mock, fallback nếu không tìm thấy
  const emp = EMPLOYEES.find((e) => e.id === user?.id) || EMPLOYEES[0];

  // Helper format tiền tệ
  const formatMoney = (num) => num ? num.toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  // Helper render trạng thái
  const renderStatusBadge = (status) => {
    const colors = {
      Draft: "#6c757d",      // Xám
      Pending: "#ffc107",    // Vàng
      Approved: "#28a745",   // Xanh lá
    };
    return (
      <span style={{
        background: colors[status] || "#ccc",
        color: "white",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
        textTransform: "uppercase"
      }}>
        {status || "Unknown"}
      </span>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
           <h2 style={{ margin: 0 }}>Hồ sơ nhân viên</h2>
           <p style={{ color: "gray", margin: "5px 0 0 0", fontSize: "0.9rem" }}>Quản lý thông tin cá nhân và công việc</p>
        </div>
        <Link 
          to="/user/profile/edit" 
          style={{ 
            background: "#007bff", color: "white", padding: "10px 20px", 
            textDecoration: "none", borderRadius: "6px", fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          ✎ Cập nhật hồ sơ
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "25px" }}>
        
        {/* LEFT COLUMN: AVATAR & MAIN INFO */}
        <div style={{ background: "white", borderRadius: "10px", padding: "30px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center", height: "fit-content" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <img 
                    src={emp.avatar || "https://via.placeholder.com/150"} 
                    alt="Avatar" 
                    style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid #f8f9fa" }} 
                />
                <div style={{ marginTop: "10px" }}>{renderStatusBadge(emp.status)}</div>
            </div>
            
            <h3 style={{ margin: "15px 0 5px", fontSize: "1.4rem" }}>{emp.fullName}</h3>
            <div style={{ color: "#666", fontWeight: "500" }}>{emp.role}</div>
            <div style={{ color: "#999", fontSize: "0.9rem" }}>{emp.department} Dept</div>

            <hr style={{ margin: "20px 0", border: "0", borderTop: "1px solid #eee" }} />

            <div style={{ textAlign: "left", fontSize: "0.95rem" }}>
                <div style={{ marginBottom: "10px" }}>
                    <span style={{ color: "#888", display: "block", fontSize: "0.8rem" }}>EMAIL</span>
                    <div style={{ wordBreak: "break-all" }}>{emp.email}</div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <span style={{ color: "#888", display: "block", fontSize: "0.8rem" }}>ĐIỆN THOẠI</span>
                    <div>{emp.phone}</div>
                </div>
                <div>
                    <span style={{ color: "#888", display: "block", fontSize: "0.8rem" }}>NGÀY VÀO LÀM</span>
                    <div>{emp.joinDate}</div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INFO */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* 1. THÔNG TIN CÁ NHÂN */}
            <div style={{ background: "white", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h4 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "10px", color: "#333" }}>Thông tin cá nhân</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Giới tính</label>
                        <div style={{ fontWeight: "500" }}>{emp.gender === "Male" ? "Nam" : "Nữ"}</div>
                    </div>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Ngày sinh</label>
                        <div style={{ fontWeight: "500" }}>{emp.dob}</div>
                    </div>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Quốc tịch</label>
                        <div style={{ fontWeight: "500" }}>{emp.nationality}</div>
                    </div>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Địa chỉ</label>
                        <div style={{ fontWeight: "500" }}>{emp.address}</div>
                    </div>
                </div>
            </div>

            {/* 2. THÔNG TIN CÔNG VIỆC & LƯƠNG */}
            <div style={{ background: "white", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h4 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "10px", color: "#333" }}>Thông tin công việc</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Phòng ban</label>
                        <div style={{ fontWeight: "500" }}>{emp.department}</div>
                    </div>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Chức vụ</label>
                        <div style={{ fontWeight: "500" }}>{emp.role}</div>
                    </div>
                    {/* Chỉ hiển thị lương nếu là chủ sở hữu hoặc admin (logic này xử lý ở backend, ở đây hiển thị mockup) */}
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Mức lương cơ bản</label>
                        <div style={{ fontWeight: "bold", color: "#28a745" }}>{formatMoney(emp.salary)}</div>
                    </div>
                    <div>
                        <label style={{ color: "gray", fontSize: "0.85rem" }}>Nhận Mail nội bộ</label>
                        <div style={{ fontWeight: "500" }}>
                            {emp.internalMail ? "✅ Có" : "❌ Không"}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. KỸ NĂNG & TÀI LIỆU */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                
                {/* Skills */}
                <div style={{ background: "white", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <h4 style={{ marginTop: 0, paddingBottom: "10px", color: "#333" }}>Kỹ năng</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {emp.skills && emp.skills.length > 0 ? (
                            emp.skills.map(skill => (
                                <span key={skill} style={{ background: "#e9ecef", color: "#495057", padding: "5px 12px", borderRadius: "15px", fontSize: "0.85rem", fontWeight: "500" }}>
                                    {skill}
                                </span>
                            ))
                        ) : <span style={{ color: "#999", fontStyle: "italic" }}>Chưa cập nhật kỹ năng</span>}
                    </div>
                </div>

                {/* Documents */}
                <div style={{ background: "white", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <h4 style={{ marginTop: 0, paddingBottom: "10px", color: "#333" }}>Tài liệu đính kèm</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {emp.files && emp.files.length > 0 ? (
                            emp.files.map((file, idx) => (
                                <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", fontSize: "0.9rem" }}>
                                    <span style={{ fontSize: "1.2rem" }}>📄</span>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {file.name}
                                    </span>
                                </li>
                            ))
                        ) : <span style={{ color: "#999", fontStyle: "italic" }}>Không có tài liệu</span>}
                    </ul>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}