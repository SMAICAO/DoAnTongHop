// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login page/Login';      // Import file Login.jsx
import Homepage from './Homepage/Homepage'; // Import file Homepage.jsx
import Profile from './Profile/Profile';   // Import file Profile.jsx
import EmployeeForm from './Employee form/EmployeeForm'; // Import file EmployeeForm.jsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nếu người dùng vào trang chủ "/" mà chưa đăng nhập, tự đẩy về login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Khai báo đường dẫn */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;