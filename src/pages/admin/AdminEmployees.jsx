import React, { useState } from "react";
import { EMPLOYEES } from "../../data/mockData";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState(EMPLOYEES);
  
  // State cho Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  // State cho Modal Sửa/Tạo nhanh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null); // null = Mode Create, Object = Mode Edit

  // --- LOGIC FILTER ---
  const filteredList = employees.filter((emp) => {
    // Note: Data mới dùng 'fullName', phòng trường hợp data cũ còn 'name' thì fallback
    const name = emp.fullName || emp.name || "";
    const matchName = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmail = emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === "All" || emp.department === filterDept;
    
    return (matchName || matchEmail) && matchDept;
  });

  // --- HANDLERS ---
  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const handleOpenModal = (emp = null) => {
    if (emp) {
      // Edit Mode
      setEditingEmp({ ...emp });
    } else {
      // Create Mode (Default values)
      setEditingEmp({
        id: null,
        fullName: "",
        email: "",
        phone: "",
        department: "IT",
        role: "Employee",
        salary: 0,
        status: "Active",
        avatar: "https://via.placeholder.com/150"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (editingEmp.id) {
      // Update logic
      const updatedList = employees.map((emp) => 
        emp.id === editingEmp.id ? editingEmp : emp
      );
      setEmployees(updatedList);
      alert("Đã cập nhật thông tin!");
    } else {
      // Create logic
      const newEmp = { 
        ...editingEmp, 
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0]
      };
      setEmployees([newEmp, ...employees]);
      alert("Đã thêm nhân viên mới!");
    }
    setIsModalOpen(false);
  };

  // --- HELPER: Render Status Badge ---
  const renderStatus = (status) => {
    const styles = {
      Active: { bg: "#d4edda", color: "#155724", label: "Active" },
      Approved: { bg: "#c3e6cb", color: "#155724", label: "Approved" },
      Pending: { bg: "#fff3cd", color: "#856404", label: "Pending" },
      Draft: { bg: "#e2e3e5", color: "#383d41", label: "Draft" },
      Inactive: { bg: "#f8d7da", color: "#721c24", label: "Inactive" }
    };

    const style = styles[status] || styles.Draft;

    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold"
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
           <h2 style={{ margin: 0 }}>Quản lý nhân sự</h2>
           <p style={{ margin: "5px 0 0 0", color: "gray", fontSize: 14 }}>Xem và quản lý danh sách nhân viên toàn công ty</p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          style={{ 
            background: "#007bff", color: "white", padding: "10px 20px", 
            border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold",
            display: "flex", alignItems: "center", gap: 8
          }}
        >
          + Thêm mới
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{ background: "white", padding: 15, borderRadius: 8, marginBottom: 20, display: "flex", gap: 15, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <input
          placeholder="Tìm theo tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6, minWidth: 180 }}
        >
          <option value="All">Tất cả phòng ban</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto", background: "white", borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #eee" }}>
            <tr>
              <th style={{ padding: 15, textAlign: "left", color: "#555" }}>Nhân viên</th>
              <th style={{ padding: 15, textAlign: "left", color: "#555" }}>Vị trí</th>
              <th style={{ padding: 15, textAlign: "left", color: "#555" }}>Liên hệ</th>
              <th style={{ padding: 15, textAlign: "left", color: "#555" }}>Lương CB</th>
              <th style={{ padding: 15, textAlign: "center", color: "#555" }}>Trạng thái</th>
              <th style={{ padding: 15, textAlign: "right", color: "#555" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: "1px solid #eee" }}>
                {/* 1. Name & Avatar */}
                <td style={{ padding: 15, display: "flex", alignItems: "center", gap: 15 }}>
                  <img 
                    src={emp.avatar || "https://via.placeholder.com/40"} 
                    alt="avt" 
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }} 
                  />
                  <div>
                    <div style={{ fontWeight: "bold", color: "#333" }}>{emp.fullName}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>ID: {emp.id}</div>
                  </div>
                </td>

                {/* 2. Dept & Role */}
                <td style={{ padding: 15 }}>
                  <div style={{ fontWeight: "500" }}>{emp.department}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{emp.role}</div>
                </td>

                {/* 3. Contact */}
                <td style={{ padding: 15 }}>
                  <div style={{ fontSize: 13 }}>{emp.email}</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{emp.phone}</div>
                </td>

                {/* 4. Salary */}
                <td style={{ padding: 15, fontWeight: "500" }}>
                  {emp.salary ? emp.salary.toLocaleString() + " ₫" : "-"}
                </td>

                {/* 5. Status */}
                <td style={{ padding: 15, textAlign: "center" }}>
                  {renderStatus(emp.status)}
                </td>

                {/* 6. Actions */}
                <td style={{ padding: 15, textAlign: "right" }}>
                  <button 
                    onClick={() => handleOpenModal(emp)}
                    style={{ marginRight: 10, background: "none", border: "none", color: "#007bff", cursor: "pointer", fontWeight: "600" }}
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(emp.id)}
                    style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontWeight: "600" }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#999" }}>Không tìm thấy kết quả.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- SIMPLE MODAL (KHÔNG DÙNG WIZARD FORM) --- */}
      {isModalOpen && editingEmp && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ background: "white", padding: 25, borderRadius: 10, width: 500, maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0 }}>
              {editingEmp.id ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
            </h3>
            
            <form onSubmit={handleSave} style={{ display: "grid", gap: 15 }}>
              <label>
                <strong>Họ và tên:</strong>
                <input 
                  required
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                  value={editingEmp.fullName}
                  onChange={(e) => setEditingEmp({...editingEmp, fullName: e.target.value})}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <label>
                  <strong>Email:</strong>
                  <input 
                    type="email" required
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                    value={editingEmp.email}
                    onChange={(e) => setEditingEmp({...editingEmp, email: e.target.value})}
                  />
                </label>
                <label>
                  <strong>Số điện thoại:</strong>
                  <input 
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                    value={editingEmp.phone}
                    onChange={(e) => setEditingEmp({...editingEmp, phone: e.target.value})}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                 <label>
                  <strong>Phòng ban:</strong>
                  <select 
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                    value={editingEmp.department}
                    onChange={(e) => setEditingEmp({...editingEmp, department: e.target.value})}
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </label>
                <label>
                  <strong>Chức vụ:</strong>
                  <input 
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                    value={editingEmp.role}
                    onChange={(e) => setEditingEmp({...editingEmp, role: e.target.value})}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                 <label>
                  <strong>Lương cơ bản:</strong>
                  <input 
                    type="number"
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                    value={editingEmp.salary}
                    onChange={(e) => setEditingEmp({...editingEmp, salary: parseInt(e.target.value) || 0})}
                  />
                </label>
                <label>
                  <strong>Trạng thái:</strong>
                  <select 
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ccc", borderRadius: 4 }}
                    value={editingEmp.status}
                    onChange={(e) => setEditingEmp({...editingEmp, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "10px 20px", border: "none", background: "#eee", cursor: "pointer", borderRadius: 4 }}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  style={{ padding: "10px 20px", border: "none", background: "#007bff", color: "white", cursor: "pointer", borderRadius: 4 }}
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}