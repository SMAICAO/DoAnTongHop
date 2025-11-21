import React, { useState, useEffect, useRef } from "react";
import "./EmployeeForm.css";

/* ============================
   CONSTANTS
============================ */
const ROLES = {
  HR: ["HR Executive", "HR Manager"],
  IT: ["Backend Dev", "Frontend Dev", "DevOps"],
  Sales: ["Sales Rep", "Sales Manager"],
};

const SKILL_SUGGEST = ["React", "NodeJS", "SQL", "Java", "UI/UX", "Python"];

/* ============================
   MAIN COMPONENT
============================ */
const EmployeeForm = () => {
  // 1) Load draft
  const savedDraft =
    JSON.parse(localStorage.getItem("employeeDraft")) || null;

  const [formData, setFormData] = useState(
    savedDraft || {
      fullName: "",
      gender: "",
      dob: "",
      nationality: "",
      address: "",
      phone: "",
      email: "",
      department: "",
      role: "",
      skills: [],
      files: [],
      avatar: null,
    }
  );

  // 2) Wizard steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // 3) Autosave (debounce)
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      localStorage.setItem("employeeDraft", JSON.stringify(formData));
    }, 500);
  }, [formData]);

  // 4) Handle simple changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setFormData((p) => ({ ...p, department: value, role: "" }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  // 5) Skills
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (formData.skills.includes(skillInput.trim())) return;

    setFormData((p) => ({
      ...p,
      skills: [...p.skills, skillInput.trim()],
    }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setFormData((p) => ({
      ...p,
      skills: p.skills.filter((s) => s !== skill),
    }));
  };

  // 6) Upload
  const dropRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = [...e.dataTransfer.files];

    setFormData((p) => ({
      ...p,
      files: [...p.files, ...newFiles],
    }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setFormData((p) => ({
        ...p,
        avatar: reader.result,
      }));

    reader.readAsDataURL(file);
  };

  // 7) Validate per-step
  const canNext = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.gender && formData.dob;
      case 2:
        return formData.nationality && formData.address;
      case 3:
        return formData.department && formData.role;
      default:
        return true;
    }
  };

  const next = () => {
    if (!canNext()) return alert("Vui lòng điền đủ thông tin!");
    setCurrentStep((s) => s + 1);
  };

  const back = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  // 8) Submit
  const handleSubmit = () => {
    console.log("FINAL:", formData);
    alert("Submit thành công!");
    localStorage.removeItem("employeeDraft");
  };

  /* ================================
     RENDER UI
  ================================ */
  return (
    <div className="wizard-container">
      {/* Progress bar */}
      <div className="progress-wrapper">
        <div
          className="progress-bar"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      <h2>
        Employee Form – Step {currentStep}/{totalSteps}
      </h2>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="step">
          <div className="form-field">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Giới tính</label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              Nam
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              Nữ
            </label>
          </div>

          <div className="form-field">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="step">
          <div className="form-field">
            <label>Quốc tịch</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            >
              <option value="">Chọn quốc tịch</option>
              <option value="Vietnamese">Việt Nam</option>
              <option value="American">Mỹ</option>
              <option value="Japanese">Nhật Bản</option>
            </select>
          </div>

          <div className="form-field">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-field">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Email công việc</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="step">
          <div className="form-field">
            <label>Phòng ban</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Chọn phòng ban</option>
              <option value="HR">Nhân sự</option>
              <option value="IT">Công nghệ thông tin</option>
              <option value="Sales">Bán hàng</option>
            </select>
          </div>

          <div className="form-field">
            <label>Chức vụ</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!formData.department}
            >
              <option value="">Chọn Role</option>
              {(ROLES[formData.department] || []).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div className="form-field">
            <label>Kỹ năng</label>
            <div className="chip-input">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Nhập skill & Enter"
              />
            </div>

            <div className="suggest">
              {SKILL_SUGGEST.map((s) => (
                <span
                  className="suggest-item"
                  key={s}
                  onClick={() => {
                    setSkillInput(s);
                    addSkill();
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="chips-area">
              {formData.skills.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                  <button onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <div className="step">
          <h3>Avatar (preview crop 1:1)</h3>
          <input type="file" accept="image/*" onChange={handleAvatar} />

          {formData.avatar && (
            <div className="avatar-preview">
              <img src={formData.avatar} alt="avatar" />
            </div>
          )}

          <h3>Upload tài liệu (kéo – thả)</h3>
          <div
            className="dropzone"
            ref={dropRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            Kéo – thả file vào đây
          </div>

          <ul>
            {formData.files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* STEP 5 */}
      {currentStep === 5 && (
        <div className="step review">

          <h3 className="review-title">🎉 Xác Nhận Thông Tin</h3>

          <div className="review-section">
            <h4>👤 Thông tin cá nhân</h4>
            <p><strong>Họ tên:</strong> {formData.fullName}</p>
            <p><strong>Giới tính:</strong> {formData.gender}</p>
            <p><strong>Ngày sinh:</strong> {formData.dob}</p>
            <p><strong>Quốc tịch:</strong> {formData.nationality}</p>
          </div>

          <div className="review-section">
            <h4>📍 Liên hệ</h4>
            <p><strong>Địa chỉ:</strong> {formData.address}</p>
            <p><strong>Số điện thoại:</strong> {formData.phone}</p>
            <p><strong>Email:</strong> {formData.email}</p>
          </div>

          <div className="review-section">
            <h4>🏢 Công việc</h4>
            <p><strong>Phòng ban:</strong> {formData.department}</p>
            <p><strong>Chức vụ:</strong> {formData.role}</p>
          </div>

          <div className="review-section">
            <h4>🧩 Kỹ năng</h4>
            <div className="review-skill-list">
              {formData.skills.length === 0 && <p>Không có kỹ năng nào</p>}
              {formData.skills.map((sk) => (
                <span className="review-skill-chip" key={sk}>{sk}</span>
              ))}
            </div>
          </div>

          <div className="review-section">
            <h4>🖼 Avatar</h4>
            {formData.avatar ? (
              <img className="review-avatar" src={formData.avatar} alt="avatar" />
            ) : (
              <p>Chưa tải ảnh</p>
            )}
          </div>

          <div className="review-section">
            <h4>📄 Tài liệu đính kèm</h4>
            {formData.files.length === 0 && <p>Không có file nào</p>}
            <ul>
              {formData.files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
      {/* NAVIGATION BUTTONS */}
      <div className="nav-buttons">
        {currentStep > 1 && (
          <button type="button" onClick={back}>
            Back
          </button>
        )}

        {currentStep < totalSteps && (
          <button type="button" onClick={next}>
            Next
          </button>
        )}

        {currentStep === totalSteps && (
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};
export default EmployeeForm;
