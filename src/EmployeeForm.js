import React, { useState } from 'react';
import './EmployeeForm.css';

const mockRoles = ['Developer', 'Manager', 'Analyst', 'Associate'];
const mockContractTypes = ['Full-time', 'Part-time', 'Intern'];
const defaultProfilePicture = 'https://via.placeholder.com/150';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    nationality: '',
    address: '',
    phone: '',
    email: '',
    department: '',
    role: '',
    contractType: '',
    salary: 0,
    internalMail: false,
    maritalStatus: '',
    profilePicture: null,
    skills: [],
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData(prevData => ({
      ...prevData,
      // Handle different input types: files, checkboxes, and standard text/number inputs
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Example: send data to server
  };

  // Helper function for rendering dropdown options
  const renderOptions = (options) => {
    return options.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      {/* Ảnh đại diện (File upload) */}
      <div className="form-field">
        <label>Ảnh đại diện</label>
        <img
            src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : defaultProfilePicture}
            alt="Profile Preview"
            className="profile-picture-preview"
        />
        <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            accept="image/*" // Restrict to image files
        />
      </div>

      {/* Họ và tên (Text input) */}
      <div className="form-field">
        <label htmlFor="fullName">Họ và tên</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      
      {/* Giới tính (Radio buttons) */}
      <div className="form-field" id="gender-group">
        <label>Giới tính</label>
        <label class="radio-label">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={handleChange}
          />
          Nam
        </label>
        <label class="radio-label">
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={handleChange}
          />
          Nữ
        </label>
      </div>
      
      {/* Ngày sinh (Date picker) */}
      <div className="form-field">
        <label htmlFor="dob">Ngày sinh</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>
      
      {/* Quốc tịch (Dropdown list) */}
      <div className="form-field">
        <label htmlFor="nationality">Quốc tịch</label>
        <select
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        >
          <option value="">Chọn quốc tịch</option>
          <option value="Vietnamese">Việt Nam</option>
          <option value="American">Mỹ</option>
          <option value="Japanese">Nhật Bản</option>
        </select>
      </div>
      
      {/* Địa chỉ thường trú (Textarea) */}
      <div className="form-field">
        <label htmlFor="address">Địa chỉ thường trú</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      
      {/* Số điện thoại (Text input) */}
      <div className="form-field">
        <label htmlFor="phone">Số điện thoại</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      {/* Email công việc (Email input) */}
      <div className="form-field">
        <label htmlFor="email">Email công việc</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      {/* Phòng ban (Dropdown list) */}
      <div className="form-field">
        <label htmlFor="department">Phòng ban</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Chọn phòng ban</option>
          <option value="HR">Nhân sự</option>
          <option value="IT">Công nghệ thông tin</option>
          <option value="Sales">Bán hàng</option>
        </select>
      </div>
      
      {/* Vai trò (Role) (Dropdown list) */}
      <div className="form-field">
        <label>Vai trò (Role)</label>
        <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            required
        >
            <option value="" disabled>Chọn vai trò</option>
            {renderOptions(mockRoles)}
        </select>
      </div>
      
      {/* Loại hợp đồng (Dropdown list) */}
      <div className="form-field">
        <label>Loại hợp đồng</label>
        <select 
            name="contractType" 
            value={formData.contractType} 
            onChange={handleChange}
            required
        >
            <option value="" disabled>Chọn loại hợp đồng</option>
            {renderOptions(mockContractTypes)}
        </select>
      </div>
      
      {/* Mức lương (Number input) */}
      <div className="form-field">
        <label>Mức lương</label>
        <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            min="0"
            required
        />
      </div>
      
      {/* Tình trạng hôn nhân (Dropdown list) */}
      <div className="form-field">
        <label>Tình trạng hôn nhân</label>
        <select 
            name="maritalStatus" 
            value={formData.maritalStatus} 
            onChange={handleChange}
        >
            <option value="" disabled>Chọn tình trạng</option>
            <option value="single">Độc thân</option>
            <option value="married">Đã kết hôn</option>
        </select>
      </div>
      
      {/* Kỹ năng (Text input) */}
      <div className="form-field">
        <label>Kỹ năng (Phân cách bằng dấu phẩy)</label>
        <input
            type="text"
            name="skills"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData(prev => ({
                ...prev,
                skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }))}
            placeholder="VD: React, Node.js, SQL"
        />
      </div>
      
      {/* Nhận mail nội bộ (Checkbox) */}
      <div className="form-field">
        <label id="mail">
            Nhận mail nội bộ
            <input
            type="checkbox"
            name="internalMail"
            checked={formData.internalMail}
            onChange={handleChange}
            />
        </label>
      </div>

      {/* Trạng thái kích hoạt (Checkbox) */}
      <div className="form-field">
        <label>Trạng thái kích hoạt</label>
        
        <label className="toggle-switch-container">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          
          <span className="slider round"></span>
        </label>
        
        <b>{formData.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</b>
      </div>

      <button type="submit">Lưu thông tin</button>
    </form>
  );
};

export default EmployeeForm;
