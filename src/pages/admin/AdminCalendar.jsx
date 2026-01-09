import React, { useState, useEffect } from "react";
import { TASKS, MEETINGS } from "../../data/mockData";

export default function AdminCalendar() {
  // 1. State cho "Thời gian thực" (để highlight "Hôm nay")
  const [today, setToday] = useState(new Date());

  // 2. State cho "Tháng đang xem" (để điều hướng lịch)
  // Mặc định khởi tạo là tháng hiện tại
  const [viewDate, setViewDate] = useState(new Date());

  const [meetings, setMeetings] = useState(MEETINGS);
  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: "", date: "", startTime: "", endTime: "" });

  // --- AUTO UPDATE LOGIC ---
  // Cập nhật lại biến 'today' mỗi phút để đảm bảo highlight đúng ngày (nếu treo máy qua đêm)
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 60000); // 60 giây check 1 lần
    return () => clearInterval(timer);
  }, []);

  // --- NAVIGATION LOGIC ---
  const handlePrevMonth = () => {
    // Tạo bản sao date để không mutate state trực tiếp
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
    setToday(now);      // Cập nhật lại giờ thực
    setViewDate(now);   // Nhảy view về tháng hiện tại
  };

  // --- CALENDAR LOGIC (Dựa trên viewDate) ---
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0 - 11

  // Tính số ngày trong tháng đang xem
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Tính ngày đầu tháng là thứ mấy (0: CN, 1: T2...)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  // --- DATA MERGING ---
  const taskEvents = TASKS.map(t => ({
    id: `task-${t.id}`,
    title: `[Deadline] ${t.title}`,
    date: t.deadline,
    type: "DEADLINE"
  }));

  const allEvents = [...meetings, ...taskEvents];

  const getEventsForDay = (day) => {
    // Format YYYY-MM-DD
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(e => e.date === dateStr);
  };

  const handleAddMeeting = (e) => {
    e.preventDefault();
    const meeting = { ...newMeeting, id: Date.now(), type: "MEETING" };
    setMeetings([...meetings, meeting]);
    setShowModal(false);
    setNewMeeting({ title: "", date: "", startTime: "", endTime: "" });
  };

  const handleDeleteMeeting = (id) => {
    if(window.confirm("Xóa lịch này?")) {
        setMeetings(meetings.filter(m => m.id !== id));
    }
  };

  // --- RENDER HELPERS ---
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`} style={{ background: "#f9f9f9", border: "1px solid #ddd" }} />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const events = getEventsForDay(day);

    // Kiểm tra xem ô này có phải là "Hôm nay" không
    const isToday = 
      day === today.getDate() && 
      viewMonth === today.getMonth() && 
      viewYear === today.getFullYear();

    return (
      <div 
        key={day} 
        style={{ 
          minHeight: 100, 
          border: isToday ? "2px solid #007bff" : "1px solid #ddd", // Highlight viền
          background: isToday ? "#e8f4ff" : "white",                // Highlight nền
          padding: 5, 
          position: "relative" 
        }}
      >
        <div style={{ 
          fontWeight: "bold", 
          marginBottom: 5,
          color: isToday ? "#007bff" : "inherit",
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
                fontSize: 11, padding: "2px 4px", borderRadius: 3, cursor: "pointer",
                background: ev.type === "DEADLINE" ? "#dc3545" : "#17a2b8",
                color: "white", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
              }}
            >
              {ev.type === "MEETING" && <span style={{marginRight:3, fontWeight:"bold"}} onClick={(e)=>{e.stopPropagation(); handleDeleteMeeting(ev.id)}}>×</span>}
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
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          
          {/* Nút điều hướng */}
          <div style={{display: "flex", gap: 5}}>
            <button onClick={handlePrevMonth} style={{cursor:"pointer", padding: "5px 10px"}}> &lt; </button>
            <button onClick={handleJumpToToday} style={{cursor:"pointer", padding: "5px 10px", fontWeight: "bold"}}> Hôm nay </button>
            <button onClick={handleNextMonth} style={{cursor:"pointer", padding: "5px 10px"}}> &gt; </button>
          </div>

          <div>
            <h2 style={{ margin: 0 }}>Tháng {viewMonth + 1}/{viewYear}</h2>
            <div style={{ fontSize: 13, color: "gray", marginTop: 5 }}>
              <span style={{ marginRight: 15 }}><span style={{ color: "#17a2b8" }}>■</span> Lịch họp</span>
              <span><span style={{ color: "#dc3545" }}>■</span> Deadline công việc</span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowModal(true)} style={{ background: "#28a745", color: "white", padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: 4 }}>
          + Thêm lịch họp
        </button>
      </div>

      {/* GRID LỊCH */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
          <div key={d} style={{ textAlign: "center", background: "#eee", padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>{d}</div>
        ))}
        {blanks}
        {days}
      </div>

      {/* MODAL TẠO MEETING (Giữ nguyên) */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: 20, borderRadius: 8, width: 400, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
            <h3>Tạo lịch họp mới</h3>
            <form onSubmit={handleAddMeeting} style={{ display: "grid", gap: 10 }}>
              <label>Nội dung: <input required style={{ width: "100%", padding: 5 }} value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} /></label>
              <label>Ngày: <input type="date" required style={{ width: "100%", padding: 5 }} value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} /></label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{flex:1}}>Bắt đầu: <input type="time" required style={{ width: "100%", padding: 5 }} value={newMeeting.startTime} onChange={e => setNewMeeting({...newMeeting, startTime: e.target.value})} /></label>
                <label style={{flex:1}}>Kết thúc: <input type="time" required style={{ width: "100%", padding: 5 }} value={newMeeting.endTime} onChange={e => setNewMeeting({...newMeeting, endTime: e.target.value})} /></label>
              </div>
              <div style={{ marginTop: 10, textAlign: "right" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ marginRight: 10, padding: "5px 15px", cursor: "pointer" }}>Hủy</button>
                <button type="submit" style={{ background: "#007bff", color: "white", border: "none", padding: "5px 15px", cursor: "pointer" }}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}