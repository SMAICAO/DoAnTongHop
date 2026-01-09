// src/pages/user/UserAttendance.jsx
import React, { useState, useEffect } from "react";
import { ATTENDANCE_LOGS } from "../../data/mockData";

export default function UserAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  // Trạng thái check-in hôm nay
  const [todayStatus, setTodayStatus] = useState({
    checkedIn: false,
    checkedOut: false,
    inTime: null,
    outTime: null
  });

  // Đồng hồ Real-time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hàm lấy GPS
  const handleCheckIn = () => {
    setLoadingLoc(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoadingLoc(false);
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Logic set Check In
          const timeString = currentTime.toLocaleTimeString('vi-VN');
          setTodayStatus(prev => ({ ...prev, checkedIn: true, inTime: timeString }));
          alert(`Check-in thành công lúc ${timeString}\nTọa độ: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          setLoadingLoc(false);
          alert("Không thể lấy vị trí. Vui lòng bật GPS!");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ Geolocation.");
    }
  };

  const handleCheckOut = () => {
    const timeString = currentTime.toLocaleTimeString('vi-VN');
    setTodayStatus(prev => ({ ...prev, checkedOut: true, outTime: timeString }));
    alert("Check-out thành công: " + timeString);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chấm công (Timekeeping)</h2>
      
      {/* SECTION 1: ACTION */}
      <div style={{ display: "flex", gap: 40, alignItems: "center", background: "#f9f9f9", padding: 30, borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        {/* CLOCK */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: 0, color: "#555" }}>Thời gian thực</h3>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#333", fontFamily: "monospace" }}>
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
          <div>{currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 20 }}>
          <button
            onClick={handleCheckIn}
            disabled={todayStatus.checkedIn || loadingLoc}
            style={{
              padding: "20px 40px", fontSize: "1.2rem", borderRadius: 8, border: "none", cursor: "pointer",
              background: todayStatus.checkedIn ? "#ccc" : "#28a745",
              color: "white"
            }}
          >
            {loadingLoc ? "Đang định vị..." : "VÀO CA (Check-in)"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!todayStatus.checkedIn || todayStatus.checkedOut}
            style={{
              padding: "20px 40px", fontSize: "1.2rem", borderRadius: 8, border: "none", cursor: "pointer",
              background: (!todayStatus.checkedIn || todayStatus.checkedOut) ? "#ccc" : "#dc3545",
              color: "white"
            }}
          >
            TAN CA (Check-out)
          </button>
        </div>
      </div>
      
      {/* INFO DISPLAY */}
      <div style={{ marginTop: 20 }}>
        {todayStatus.inTime && <p>Giờ vào: <strong>{todayStatus.inTime}</strong> {location && <small>(GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)})</small>}</p>}
        {todayStatus.outTime && <p>Giờ ra: <strong>{todayStatus.outTime}</strong></p>}
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* SECTION 2: HISTORY */}
      <h3>Lịch sử chấm công (Tháng 10/2023)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
        <thead>
          <tr style={{ background: "#eee", textAlign: "left" }}>
            <th style={{ padding: 10 }}>Ngày</th>
            <th style={{ padding: 10 }}>Giờ vào</th>
            <th style={{ padding: 10 }}>Giờ ra</th>
            <th style={{ padding: 10 }}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {ATTENDANCE_LOGS.filter(l => l.userId === 1).map((log, index) => { // Giả lập user 1
            let badgeColor = "#ccc";
            let statusText = "Không xác định";
            if (log.status === "X") { badgeColor = "#28a745"; statusText = "Đúng giờ"; }
            if (log.status === "M") { badgeColor = "#ffc107"; statusText = "Đi muộn"; }
            if (log.status === "V") { badgeColor = "#dc3545"; statusText = "Vắng mặt"; }

            return (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 10 }}>{log.date}</td>
                <td style={{ padding: 10 }}>{log.checkIn || "--:--"}</td>
                <td style={{ padding: 10 }}>{log.checkOut || "--:--"}</td>
                <td style={{ padding: 10 }}>
                  <span style={{ background: badgeColor, color: "white", padding: "4px 8px", borderRadius: 4, fontSize: 12 }}>
                    {statusText}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}