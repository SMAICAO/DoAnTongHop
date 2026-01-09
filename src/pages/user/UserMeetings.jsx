import React, { useState, useEffect } from "react";
import { TASKS, MEETINGS } from "../../data/mockData";
import { useAuth } from "../../auth/AuthContext";

export default function UserMeetings() {
  const { user } = useAuth();
  
  // 1. State quản lý thời gian thực (để highlight "Hôm nay")
  const [today, setToday] = useState(new Date());

  // 2. State quản lý tháng đang xem (Navigation)
  const [viewDate, setViewDate] = useState(new Date());

  // --- AUTO UPDATE CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000); // Cập nhật mỗi phút
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

  // --- CALENDAR CALCULATION ---
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 (CN) -> 6 (T7)

  // --- DATA FILTERING & MERGING ---
  // 1. Lọc Task: Chỉ lấy task được giao cho user hiện tại
  const myTasks = TASKS.filter(t => t.assigneeIds.includes(user?.id)).map(t => ({
    id: `task-${t.id}`,
    title: `[Deadline] ${t.title}`,
    date: t.deadline,
    type: "DEADLINE"
  }));

  // 2. Gộp với Meetings (Giả sử Meetings là chung cho toàn công ty)
  const myEvents = [...MEETINGS, ...myTasks];

  const getEventsForDay = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return myEvents.filter(e => e.date === dateStr);
  };

  // --- RENDER HELPERS ---
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`} style={{ background: "#f9f9f9", border: "1px solid #ddd" }} />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const events = getEventsForDay(day);

    // Check ngày hôm nay để highlight
    const isToday = 
      day === today.getDate() && 
      viewMonth === today.getMonth() && 
      viewYear === today.getFullYear();

    return (
      <div 
        key={day} 
        style={{ 
          minHeight: 100, 
          border: isToday ? "2px solid #007bff" : "1px solid #ddd", 
          background: isToday ? "#e8f4ff" : "white",
          padding: 5, 
          position: "relative" 
        }}
      >
        <div style={{ 
          fontWeight: "bold", 
          marginBottom: 5,
          color: isToday ? "#007bff" : "#333",
          display: "flex", justifyContent: "space-between"
        }}>
          {day}
          {isToday && <span style={{fontSize: 10, background: "#007bff", color: "white", padding: "1px 4px", borderRadius: 4}}>Hôm nay</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              title={ev.title}
              style={{
                fontSize: 11, padding: "2px 4px", borderRadius: 3,
                background: ev.type === "DEADLINE" ? "#dc3545" : "#17a2b8",
                color: "white", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
              }}
            >
              {ev.startTime ? `${ev.startTime} ` : ""}
              {ev.title}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER CONTROL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        
        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{display: "flex", gap: 5}}>
            <button onClick={handlePrevMonth} style={{cursor:"pointer", padding: "5px 10px"}}> &lt; </button>
            <button onClick={handleJumpToToday} style={{cursor:"pointer", padding: "5px 10px", fontWeight: "bold"}}> Hôm nay </button>
            <button onClick={handleNextMonth} style={{cursor:"pointer", padding: "5px 10px"}}> &gt; </button>
          </div>

          <div>
            <h2 style={{ margin: 0 }}>Lịch làm việc - Tháng {viewMonth + 1}/{viewYear}</h2>
            <div style={{ fontSize: 13, color: "gray", marginTop: 5 }}>
              <span style={{ marginRight: 15 }}><span style={{ color: "#17a2b8" }}>■</span> Lịch họp chung</span>
              <span><span style={{ color: "#dc3545" }}>■</span> Deadline của tôi</span>
            </div>
          </div>
        </div>

        {/* User View không có nút "Thêm mới" */}
      </div>

      {/* GRID CALENDAR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
          <div key={d} style={{ textAlign: "center", background: "#eee", padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>{d}</div>
        ))}
        {blanks}
        {days}
      </div>
    </div>
  );
}