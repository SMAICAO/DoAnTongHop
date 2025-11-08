import React, { useState } from 'react';
import "./App.css";

// Mock data for dropdowns
const mockRoles = ['Developer', 'Manager', 'Analyst', 'Associate'];
const mockContractTypes = ['Full-time', 'Part-time', 'Intern'];

const UserProfileForm = () => {
  // 1. State to manage form data
  const [formData, setFormData] = useState({
    department: '',
    role: '',
    contractType: '',
    salary: 0,
    internalMail: false,
    maritalStatus: '',
    profilePicture: null,
    policyConsent: false, // Required checkbox
    skills: [], // Array for multi-select
    isActive: true, // For the toggle switch
  });

  // 2. Generic change handler for most inputs
  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setFormData(prevData => ({
      ...prevData,
      // Handle different input types: files, checkboxes, and standard text/number inputs
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
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
      
      {/* 2. Vai trò (Role) (Dropdown list) */}
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

      {/* 3. Loại hợp đồng (Dropdown list) */}
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

      {/* 4. Mức lương (Number input) */}
      <label>Mức lương</label>
      <input
        type="number"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        min="0"
        required
      />

      {/* 5. Nhận mail nội bộ (Checkbox) */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Nhận mail nội bộ
        <input
          type="checkbox"
          name="internalMail"
          checked={formData.internalMail}
          onChange={handleChange}
        />
      </label>

      {/* 6. Tình trạng hôn nhân (Dropdown or Radio button - using Dropdown here) */}
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

      {/* 7. Ảnh đại diện (File upload) */}
      <label>Ảnh đại diện</label>
      <input
        type="file"
        name="profilePicture"
        onChange={handleChange}
        accept="image/*" // Restrict to image files
      />

      {/* 8. Xác nhận đồng ý chính sách (Checkbox - required) */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Xác nhận đồng ý chính sách **(Bắt buộc)**
        <input
          type="checkbox"
          name="policyConsent"
          checked={formData.policyConsent}
          onChange={handleChange}
          required // HTML5 required attribute
        />
      </label>
      
      {/* 9. Kỹ năng (Multi-select dropdown) */}
      {/* NOTE: Implementing a true multi-select dropdown is complex. 
               In a real app, you'd use a dedicated library like 'react-select'. 
               This is a simple text area placeholder for demonstration. */}
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


      {/* 10. Trạng thái kích hoạt (Toggle switch) */}
      <div className="form-group">
        <label>Trạng thái kích hoạt</label>
        
        {/* The main switch structure */}
        <label className="toggle-switch-container">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            // Add a unique ID for better accessibility if needed, e.g., id="isActiveToggle"
          />
          
          {/* This span is the visual representation of the switch/slider */}
          <span className="slider round"></span>
        </label>
        
        <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
          {formData.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
        </span>
      </div>

      <style jsx>{`
        /* --- CSS FOR TOGGLE SWITCH --- */
        
        /* 1. Hide the default HTML checkbox */
        .toggle-switch-container input {
          opacity: 0; /* Make it invisible */
          width: 0;
          height: 0;
        }

        /* 2. Style the 'slider' (the track of the switch) */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc; /* Inactive color */
          transition: 0.4s;
        }

        /* 3. Style the 'knob' (the circle or handle) using ::before */
        .slider::before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px; /* Space from the left edge of the track */
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
        }

        /* 4. Define the container dimensions and positioning */
        .toggle-switch-container {
          position: relative;
          display: inline-block;
          width: 60px; /* Overall width */
          height: 28px; /* Overall height */
          margin-left: 10px; /* Spacing */
          vertical-align: middle;
        }

        /* 5. Change track color when the checkbox IS CHECKED */
        .toggle-switch-container input:checked + .slider {
          background-color: #2196F3; /* Active color (blue) */
        }

        /* 6. Move the knob to the right when the checkbox IS CHECKED */
        .toggle-switch-container input:checked + .slider::before {
          transform: translateX(32px); /* 60px (width) - 28px (knob+padding) = 32px */
        }

        /* 7. Optional: Make the switch rounded (pill shape) */
        .slider.round {
          border-radius: 34px;
        }

        .slider.round::before {
          border-radius: 50%; /* Make the knob circular */
        }

        /* --- General Form Styling for context --- */
        .form-group {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .form-group > label:first-child {
            width: 150px; /* Aligning the field labels */
        }
      `}</style>
    </form>
  );
};

export default UserProfileForm;