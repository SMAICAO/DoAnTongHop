// src/data/mockData.js

// --- HELPER FUNCTIONS ĐỂ TẠO DATA ĐỘNG ---
const today = new Date();

// Hàm lấy chuỗi YYYY-MM-DD dựa trên offset (số ngày lệch so với hôm nay)
// offset = 0 là hôm nay, -1 là hôm qua, 30 là tháng sau...
const getRelativeDate = (offsetDays) => {
  const date = new Date(today);
  date.setDate(today.getDate() + offsetDays);
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// --- 1. DANH SÁCH NHÂN VIÊN ---
export const EMPLOYEES = [
  {
    id: 1,
    fullName: "Nguyễn Văn A", // Đổi name -> fullName cho khớp form
    gender: "Male",           // Mới
    dob: "1995-05-20",
    nationality: "Vietnamese", // Mới
    avatar: "https://via.placeholder.com/150",
    
    department: "IT",
    role: "Backend Dev",      // Khớp với ROLES trong form
    status: "Approved",       // Draft, Pending, Approved
    
    email: "vana@company.com",
    phone: "0901234567",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    
    salary: 15000000,
    contractType: "Full-time",
    internalMail: true,       // Mới
    
    skills: ["React", "NodeJS", "SQL"], // Mới
    files: [                            // Mới
      { name: "bang-cap-dai-hoc.pdf", size: 102400 },
      { name: "chung-chi-tieng-anh.jpg", size: 51200 }
    ],
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    gender: "Female",
    dob: "1992-08-15",
    nationality: "Vietnamese",
    avatar: "https://via.placeholder.com/150",
    
    department: "HR",
    role: "HR Manager",
    status: "Approved",
    
    email: "thib@company.com",
    phone: "0909888777",
    address: "456 Nguyễn Huệ, TP.HCM",
    
    salary: 20000000,
    contractType: "Full-time",
    internalMail: true,
    
    skills: ["Communication", "Excel", "Labor Law"],
    files: [],
    joinDate: "2022-03-10",
  },
  // ... thêm nhân viên khác nếu cần
];

// --- 2. LOG CHẤM CÔNG (Dữ liệu 3 ngày gần nhất) ---
export const ATTENDANCE_LOGS = [
  // Hôm kia
  { userId: 1, date: getRelativeDate(-2), status: "X", checkIn: "08:00", checkOut: "17:30" },
  { userId: 2, date: getRelativeDate(-2), status: "X", checkIn: "07:55", checkOut: "18:00" },
  // Hôm qua
  { userId: 1, date: getRelativeDate(-1), status: "M", checkIn: "08:45", checkOut: "17:30" },
  // Hôm nay (User 1 chưa check out)
  { userId: 1, date: getRelativeDate(0), status: "X", checkIn: "08:05", checkOut: null },
];

// --- 3. DANH SÁCH CÔNG VIỆC (TASKS) ---
export const TASKS = [
  {
    id: 1,
    title: "Deadline Gấp Hôm Nay",
    description: "Task này để test highlight ngày hôm nay.",
    assigneeIds: [1],
    deadline: getRelativeDate(0), // HÔM NAY
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Báo cáo tháng trước",
    description: "Task đã qua hạn.",
    assigneeIds: [2],
    deadline: getRelativeDate(-10), // 10 ngày trước (Có thể thuộc tháng trước)
    priority: "Medium",
    status: "Done",
  },
  {
    id: 3,
    title: "Chuẩn bị Plan tháng sau",
    description: "Task tương lai xa.",
    assigneeIds: [1, 3],
    deadline: getRelativeDate(30), // 30 ngày sau (Thuộc tháng sau)
    priority: "Low",
    status: "To Do",
  },
  {
    id: 4,
    title: "Fix bug giao diện",
    description: "Task tuần này.",
    assigneeIds: [1],
    deadline: getRelativeDate(3), // 3 ngày nữa
    priority: "High",
    status: "To Do",
  }
];

// --- 4. LỊCH HỌP (MEETINGS) ---
export const MEETINGS = [
  {
    id: 101,
    title: "Họp Giao Ban Sáng Nay",
    date: getRelativeDate(0), // HÔM NAY
    startTime: "09:00",
    endTime: "10:30",
    type: "MEETING",
  },
  {
    id: 102,
    title: "Review lương (Tháng trước)",
    date: getRelativeDate(-25), // Tháng trước
    startTime: "14:00",
    endTime: "15:30",
    type: "MEETING",
  },
  {
    id: 103,
    title: "Kickoff dự án mới",
    date: getRelativeDate(5), // 5 ngày nữa
    startTime: "10:00",
    endTime: "11:30",
    type: "MEETING",
  },
  {
    id: 104,
    title: "Teambuilding (Tháng sau)",
    date: getRelativeDate(35), // Tháng sau
    startTime: "08:00",
    endTime: "17:00",
    type: "MEETING",
  },
];