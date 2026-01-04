// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook này

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 2. Khởi tạo hàm điều hướng

  const handleLogin = (e) => {
    e.preventDefault(); // Chặn việc reload form mặc định

    // --- Giả lập gọi API kiểm tra đăng nhập ---
    // Trong thực tế bạn sẽ dùng axios.post('/api/login', ...)
    
    const isLoginSuccess = true; // Giả sử đăng nhập đúng
    const userRole = 'admin';    // Giả sử server trả về role là admin

    if (isLoginSuccess) {
      // Lưu thông tin để các trang kia biết đã đăng nhập
      localStorage.setItem('userToken', 'abc-xyz-token'); 
      localStorage.setItem('userRole', userRole);

      // 3. Logic điều hướng (Phân luồng)
      if (userRole === 'admin') {
        // Nếu là sếp -> Sang trang Homepage (Dashboard)
        navigate('/home'); 
      } else {
        // Nếu là nhân viên -> Sang trang Profile cá nhân
        navigate('/profile');
      }
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập HRM</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập" 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;