import React, { useState, useEffect } from "react";
import { EMPLOYEES, ATTENDANCE_LOGS } from "../../data/mockData";

export default function AdminTimesheet() {
  // 1. State quản lý thời gian (Giống AdminCalendar)
  const [today, setToday] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date()); // Tháng đang xem
  
  // 2. State quản lý nhân viên đang được chọn (Mặc định người đầu tiên)
  const [selectedEmpId, setSelectedEmpId] = useState(EMPLOYEES[0]?.id || 1);
  
  // 3. State lưu logs (để có thể sửa đổi trên UI)
  const [logs, setLogs] = useState(ATTENDANCE_LOGS);

  // Auto update realtime
  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- NAVIGATION LOGIC ---
  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setToday(now);
    setViewDate(now);
  };

  // --- CALENDAR LOGIC ---
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 (Sun) -> 6 (Sat)

  // --- HELPER: Lấy log của nhân viên được chọn vào ngày cụ thể ---
  const getLogForDay = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return logs.find(l => l.userId === parseInt(selectedEmpId) && l.date === dateStr);
  };

  // --- ACTION: Sửa công (Admin Override) ---
  const handleEditLog = (day, currentLog) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const newStatus = prompt(`Sửa trạng thái ngày ${day}/${viewMonth + 1} (X=Đủ, M=Muộn, V=Vắng):`, currentLog?.status || "");
    
    if (newStatus) {
      // Logic cập nhật state giả lập
      const updatedLogs = logs.filter(l => !(l.userId === parseInt(selectedEmpId) && l.date === dateStr));
      updatedLogs.push({
        userId: parseInt(selectedEmpId),
        date: dateStr,
        status: newStatus.toUpperCase(),
        checkIn: currentLog?.checkIn || "08:00", // Default nếu admin tạo mới
        checkOut: currentLog?.checkOut || "17:30"
      });
      setLogs(updatedLogs);
      alert("Đã cập nhật công!");
    }
  };

  // --- RENDER HELPERS ---
  // Ô trống đầu tháng
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`} style={{ background: "#f9f9f9", border: "1px solid #ddd" }} />
  ));

  // Các ngày trong tháng
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const log = getLogForDay(day);
    
    // Check ngày hôm nay
    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
    
    // Style dựa trên status
    let bgColor = "white";
    let statusText = "";
    if (log?.status === "X") { bgColor = "#d4edda"; statusText = "Đủ công"; }
    else if (log?.status === "M") { bgColor = "#fff3cd"; statusText = "Đi muộn"; }
    else if (log?.status === "V") { bgColor = "#f8d7da"; statusText = "Vắng"; }

    return (
      <div 
        key={day} 
        onClick={() => handleEditLog(day, log)}
        style={{ 
          minHeight: 100, 
          border: isToday ? "2px solid #007bff" : "1px solid #ddd", 
          background: bgColor,
          padding: 8, 
          position: "relative",
          cursor: "pointer",
          transition: "0.2s"
        }}
        title="Click để sửa công"
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontWeight: "bold", color: isToday ? "#007bff" : "#333" }}>{day}</span>
          {log?.status && (
            <span style={{ fontWeight: "bold", fontSize: 12 }}>{log.status}</span>
          )}
        </div>

        {log ? (
          <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 2 }}>
            <div>In: <strong>{log.checkIn || "--:--"}</strong></div>
            <div>Out: <strong>{log.checkOut || "--:--"}</strong></div>
            <div style={{fontStyle:"italic", color:"#555"}}>{statusText}</div>
          </div>
        ) : (
           <div style={{ fontSize: 11, color: "#999", marginTop: 10, textAlign:"center" }}>- Trống -</div>
        )}
      </div>
    );
  });

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER CONTROL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 15 }}>
        
        {/* Left: Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{display: "flex", gap: 5}}>
            <button onClick={handlePrevMonth} style={{cursor:"pointer", padding: "5px 10px"}}> &lt; </button>
            <button onClick={handleJumpToToday} style={{cursor:"pointer", padding: "5px 10px", fontWeight: "bold"}}> Hôm nay </button>
            <button onClick={handleNextMonth} style={{cursor:"pointer", padding: "5px 10px"}}> &gt; </button>
          </div>
          <h2 style={{ margin: 0 }}>Tháng {viewMonth + 1}/{viewYear}</h2>
        </div>

        {/* Right: Employee Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontWeight: "bold" }}>Xem công nhân viên:</label>
          <select 
            value={selectedEmpId} 
            onChange={(e) => setSelectedEmpId(e.target.value)}
            style={{ padding: 8, borderRadius: 4, minWidth: 200 }}
          >
            {EMPLOYEES.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
            ))}
          </select>
        </div>
      </div>

      {/* CHÚ THÍCH MÀU */}
      <div style={{ display: "flex", gap: 20, marginBottom: 15, fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{width: 15, height: 15, background: "#d4edda", border: "1px solid #ccc"}}></span> Đủ công (X)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{width: 15, height: 15, background: "#fff3cd", border: "1px solid #ccc"}}></span> Đi muộn (M)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{width: 15, height: 15, background: "#f8d7da", border: "1px solid #ccc"}}></span> Vắng (V)</div>
      </div>

      {/* GRID CALENDAR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
          <div key={d} style={{ textAlign: "center", background: "#eee", padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>{d}</div>
        ))}
        {blanks}
        {days}
      </div>
      
      <p style={{ marginTop: 15, fontStyle: "italic", color: "gray", fontSize: 13 }}>* Click vào ô ngày để Admin sửa công thủ công (Manual Override).</p>
    </div>
  );
}