import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NumericFormat } from 'react-number-format';
import { IMaskInput } from 'react-imask';
import './EmployeeForm.css';

// --- CONSTANTS ---
const ROLES = {
  HR: ["HR Executive", "HR Manager"],
  IT: ["Backend Dev", "Frontend Dev", "DevOps"],
  Sales: ["Sales Rep", "Sales Manager"],
};

const SKILL_SUGGEST = ["React", "NodeJS", "SQL", "Java", "UI/UX", "Python"];

const INITIAL_STATE = {
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
  maritalStatus: '',
  internalMail: false,
  isActive: true,
  skills: [],
  files: [],
  avatar: null,
  status: 'Draft'
};

// --- I18N ---
const translations = {
  vi: {
    title: "Hồ sơ nhân viên",
    fullName: "Họ và tên",
    gender: "Giới tính",
    male: "Nam",
    female: "Nữ",
    dob: "Ngày sinh",
    nationality: "Quốc tịch",
    selectNationality: "Chọn quốc tịch",
    address: "Địa chỉ",
    phone: "Số điện thoại",
    email: "Email công việc",
    department: "Phòng ban",
    role: "Chức vụ",
    salary: "Mức lương",
    maritalStatus: "Tình trạng hôn nhân",
    skills: "Kỹ năng",
    internalMail: "Nhận mail nội bộ",
    isActive: "Trạng thái",
    active: "Đã kích hoạt",
    inactive: "Chưa kích hoạt",
    saveDraft: "Lưu nháp",
    submitApproval: "Gửi duyệt",
    status: "Trạng thái hồ sơ",
    next: "Tiếp tục",
    back: "Quay lại",
    upload: "Tải tài liệu (Kéo thả)",
    review: "Xác nhận thông tin",
    print: "In hồ sơ",
    newForm: "Biểu mẫu mới",
    // Errors
    errRequired: "Bắt buộc",
    errGender: "Vui lòng chọn giới tính",
    errMin5: "Tối thiểu 5 ký tự",
    errPhone: "SĐT không hợp lệ",
    errEmail: "Email không hợp lệ",
    errSalary: "Lương không âm",
  },
  en: {
    title: "Employee Profile",
    fullName: "Full Name",
    gender: "Gender",
    male: "Male",
    female: "Female",
    dob: "Date of Birth",
    nationality: "Nationality",
    selectNationality: "Select Nationality",
    address: "Address",
    phone: "Phone",
    email: "Work Email",
    department: "Department",
    role: "Role",
    salary: "Salary",
    maritalStatus: "Marital Status",
    skills: "Skills",
    internalMail: "Internal Mail",
    isActive: "Status",
    active: "Active",
    inactive: "Inactive",
    saveDraft: "Save Draft",
    submitApproval: "Submit",
    status: "Profile Status",
    next: "Next",
    back: "Back",
    upload: "Upload Documents (Drag & Drop)",
    review: "Review Information",
    print: "Print Profile",
    newForm: "New Form",
    // Errors
    errRequired: "Required",
    errGender: "Please select gender",
    errMin5: "Min 5 chars",
    errPhone: "Invalid Phone",
    errEmail: "Invalid Email",
    errSalary: "No negative salary",
  }
};

// --- MAIN COMPONENT ---
const EmployeeForm = () => {
  // 1. State & Hooks
  const [lang, setLang] = useState('vi');
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const dropRef = useRef(null);
  
  // Check LocalStorage for initial values
  const savedDraft = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("employeeDraft"));
    } catch { return null; }
  }, []);

  const t = (key) => translations[lang][key] || key;
  const totalSteps = 5;

  // 2. Zod Schema (Memoized for i18n)
  const employeeSchema = useMemo(() => z.object({
    fullName: z.string().min(1, t('errRequired')),
    gender: z.enum(["Male", "Female"], { 
      // This errorMap catches the issue when value is "" (empty)
      errorMap: () => ({ message: t('errGender')}) 
    }),
    dob: z.string().min(1, t('errRequired')),
    nationality: z.string().min(1, t('errRequired')),
    address: z.string().min(5, t('errMin5')),
    phone: z.preprocess(
      (val) => String(val).replace(/\s/g, ''),
      z.string().regex(/^[0-9]{10,11}$/, t('errPhone'))
    ),
    email: z.email(t('errEmail')),
    department: z.string().min(1, t('errRequired')),
    role: z.string().min(1, t('errRequired')),
    salary: z.preprocess(
       (val) => Number(String(val).replace(/,/g, '')),
       z.number().min(0, t('errSalary'))
    ),
    internalMail: z.boolean(),
    // Skills and Files are arrays now
    skills: z.array(z.string()).optional(),
    files: z.array(z.any()).optional(),
    avatar: z.string().nullable().optional(), // Base64 string for simplicity
    status: z.enum(['Draft', 'Pending', 'Approved']).default('Draft'),
  }), [lang, t]);

  // 3. React Hook Form Setup
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
    defaultValues: savedDraft || {
      fullName: '', gender: '', dob: '',
      nationality: '', address: '', phone: '', email: '',
      department: '', role: '',
      salary: 0, internalMail: false,
      skills: [], files: [], avatar: null, status: 'Draft'
    },
  });

  const allValues = watch(); // Watch all for autosave and review
  const formStatus = watch('status') || 'Draft';
  const isApproved = formStatus === 'Approved';

  // 4. Logic: Autosave
  const timer = useRef(null);
  
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      localStorage.setItem("employeeDraft", JSON.stringify(allValues));
    }, 500);
  }, [allValues]);

  // 5. Logic: Dynamic Roles
  const selectedDept = watch('department');
  useEffect(() => {
    // Only reset role if the current role doesn't exist in the new department
    const currentRole = getValues('role');
    const allowedRoles = ROLES[selectedDept] || [];
    if (selectedDept && currentRole && !allowedRoles.includes(currentRole)) {
      setValue('role', '');
    }
  }, [selectedDept, setValue, getValues]);

  // 6. Logic: Navigation & Step Validation
  // Define which fields belong to which step for validation
  const stepFields = {
    1: ['fullName', 'gender', 'dob'],
    2: ['nationality', 'address', 'phone', 'email'],
    3: ['department', 'role', 'contractType', 'salary'],
    4: [], // Uploads are optional in this schema, if strict, add here
    5: []
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const isValid = await trigger(fields); // Trigger validation for current step fields
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  // 7. Logic: Skills Chip System
  const addSkill = (newSkill) => {
    const trimmed = newSkill.trim();
    const currentSkills = getValues('skills') || [];
    if (trimmed && !currentSkills.includes(trimmed)) {
      setValue('skills', [...currentSkills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = getValues('skills') || [];
    setValue('skills', currentSkills.filter(s => s !== skillToRemove));
  };

  // 8. Logic: File Upload (Drag & Drop + Avatar)
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const currentFiles = getValues('files') || [];
    // Store simple object to avoid circular JSON errors in localStorage
    const fileMetas = droppedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }));
    setValue('files', [...currentFiles, ...fileMetas]);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setValue('avatar', reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 9. Submission Handlers
  const onSaveDraft = () => {
    setValue('status', 'Draft');
    const data = getValues();
    console.log("💾 Saved Draft:", data);
    alert(t('saveDraft') + " OK!");
  };

  const onSubmitApproval = (data) => {
    setValue('status', 'Pending');
    console.log("🚀 Submitted:", data);
    localStorage.removeItem("employeeDraft"); // Clear draft on success
    
    // Mock Approval Flow
    setTimeout(() => {
       if(window.confirm("HR Manager: Approve this profile?")) {
           setValue('status', 'Approved');
       }
    }, 500);
  };

  // Helper for A11y
  const getAria = (name) => ({
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined
  });

  // Reset Handler
  const handleReset = () => {
  if (window.confirm("Are you sure? This will clear all data and the saved draft.")) {
    // 1. Clear Local Storage
    localStorage.removeItem("employeeDraft");

    // 2. Reset React Hook Form to initial state
    reset(INITIAL_STATE);

    // 3. Reset Wizard Step
    setCurrentStep(1);
    
    // 4. Reset Status (Local state if you used it, or RHF state)
    setSkillInput(""); // Clear the skill text box if it has text
    window.scrollTo(0, 0); // Scroll to top
  }
};

  /* ================= RENDERING ================= */
  return (
    <div className="wizard-container">
      {/* HEADER */}
      <div className="form-header">
        <div className="status-badge">
           <strong>{t('status')}: </strong>
           <span className={`badge ${formStatus.toLowerCase()}`}>{formStatus}</span>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
            <button type="button" className="btn-secondary" onClick={handleReset} title="Reset Form">
              🔄 {t('newForm')}
            </button>
            
            <button type="button" className="btn-secondary" onClick={() => setLang(l => l === 'vi' ? 'en' : 'vi')}>
              🌐 {lang.toUpperCase()}
            </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
      </div>
      
      <h3>Employee Form - Step {currentStep}/{totalSteps}: {
          currentStep === 1 ? t('title') : 
          currentStep === 2 ? "Contact" : 
          currentStep === 3 ? "Job Details" : 
          currentStep === 4 ? "Uploads" : "Review"
      }</h3>

      <form onSubmit={handleSubmit(onSubmitApproval)} className="employee-form">
        
        {/* --- STEP 1: Personal Info --- */}
        {currentStep === 1 && (
          <div className="step fade-in">
            <div className="form-field">
              <label htmlFor="fullName">{t('fullName')} <span className="required">*</span></label>
              <input type="text" id="fullName" {...register('fullName')} {...getAria('fullName')} />
              {errors.fullName && <span className="error-msg">{errors.fullName.message}</span>}
            </div>

            <div className="form-field">
               <label>{t('gender')} <span className="required">*</span></label>
               <div className="radio-group">
                 <label className="radio-label">
                   <input type="radio" value="Male" {...register('gender')} /> {t('male')}
                 </label>
                 <label className="radio-label">
                   <input type="radio" value="Female" {...register('gender')} /> {t('female')}
                 </label>
               </div>
               {errors.gender && <span className="error-msg">{errors.gender.message}</span>}
            </div>

            <div className="form-field">
               <label htmlFor="dob">{t('dob')} <span className="required">*</span></label>
               <input type="date" id="dob" {...register('dob')} {...getAria('dob')} />
               {errors.dob && <span className="error-msg">{errors.dob.message}</span>}
            </div>
          </div>
        )}

        {/* --- STEP 2: Contact --- */}
        {currentStep === 2 && (
          <div className="step fade-in">
             <div className="form-field">
               <label>{t('nationality')} <span className="required">*</span></label>
               <select {...register('nationality')} {...getAria('nationality')}>
                  <option value="">{t('selectNationality')}</option>
                  <option value="Vietnamese">Vietnam</option>
                  <option value="American">USA</option>
                  <option value="Japanese">Japan</option>
               </select>
               {errors.nationality && <span className="error-msg">{errors.nationality.message}</span>}
             </div>

             <div className="form-field">
                <label>{t('address')} <span className="required">*</span></label>
                <textarea {...register('address')} {...getAria('address')} />
                {errors.address && <span className="error-msg">{errors.address.message}</span>}
             </div>

             <div className="form-field">
                <label htmlFor="phone">{t('phone')} <span className="required">*</span></label>
                <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                    <IMaskInput
                    type="text"
                    mask="0000 000 000"
                    id="phone"
                    definitions={{ '0': /[0-9]/ }}
                    value={value}
                    onAccept={(val) => onChange(val)}
                    onBlur={onBlur}
                    placeholder="xxxx xxx xxx"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                )}
                />
                {errors.phone && <span id="phone-error" className="error-msg">{errors.phone.message}</span>}
             </div>

             <div className="form-field">
                <label>{t('email')} <span className="required">*</span></label>
                <input type="email" {...register('email')} {...getAria('email')} />
                {errors.email && <span className="error-msg">{errors.email.message}</span>}
             </div>
          </div>
        )}

        {/* --- STEP 3: Job Details --- */}
        {currentStep === 3 && (
           <div className="step fade-in">
              <div className="form-field">
                 <label>{t('department')} <span className="required">*</span></label>
                 <select {...register('department')} {...getAria('department')}>
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                 </select>
                 {errors.department && <span className="error-msg">{errors.department.message}</span>}
              </div>

              <div className="form-field">
                 <label>{t('role')} <span className="required">*</span></label>
                 <select {...register('role')} disabled={!selectedDept} {...getAria('role')}>
                    <option value="">Select Role</option>
                    {(ROLES[selectedDept] || []).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                 </select>
                 {errors.role && <span className="error-msg">{errors.role.message}</span>}
              </div>

              <div className="form-field">
                  <label>{t('salary')} <span className="required">*</span> {isApproved && '🔒'}</label>
                  <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => (
                       <NumericFormat 
                          {...field} 
                          type="text"
                          thousandSeparator="," 
                          suffix=" ₫" 
                          disabled={isApproved}
                          onValueChange={(v) => field.onChange(v.value)}
                       />
                    )}
                  />
                  {errors.salary && <span className="error-msg">{errors.salary.message}</span>}
              </div>

              {/* Skill Chips Integration */}
              <div className="form-field">
                  <label>{t('skills')}</label>
                  <div className="chip-input">
                     <input 
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); }
                        }}
                        placeholder="Type & Enter"
                     />
                  </div>
                  <div className="suggest">
                      {SKILL_SUGGEST.map(s => (
                          <span key={s} className="suggest-item" onClick={() => addSkill(s)}>{s}</span>
                      ))}
                  </div>
                  <div className="chips-area">
                      {(watch('skills') || []).map(skill => (
                          <span key={skill} className="chip">
                              {skill} <button type="button" onClick={() => removeSkill(skill)}>×</button>
                          </span>
                      ))}
                  </div>
              </div>
           </div>
        )}

        {/* --- STEP 4: Uploads --- */}
        {currentStep === 4 && (
            <div className="step fade-in">
               <div className="form-field">
                  <label>{t('profilePic')}</label>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                      {watch('avatar') ? 
                        <img src={watch('avatar')} alt="Preview" className="review-avatar"/> : 
                        <div style={{width:100, height:100, background:'#eee', borderRadius:'50%'}}></div>
                      }
                      <input type="file" accept="image/*" onChange={handleAvatar} />
                  </div>
               </div>

               <div className="form-field">
                   <label>{t('upload')}</label>
                   <div 
                      className="dropzone"
                      ref={dropRef}
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
                      onDragLeave={(e) => { e.currentTarget.classList.remove('active'); }}
                      onDrop={handleDrop}
                   >
                      📂 Drag & Drop files here
                   </div>
                   <ul>
                       {(watch('files') || []).map((f, i) => (
                           <li key={i}>{f.name}</li>
                       ))}
                   </ul>
               </div>
            </div>
        )}

        {/* --- STEP 5: Review --- */}
        {currentStep === 5 && (
            <div className="step review fade-in">
                <h3>{t('review')}</h3>
                
                <div className="review-section">
                   <h4>Personal</h4>
                   <p><strong>{t('fullName')}:</strong> {watch('fullName')}</p>
                   <p><strong>{t('email')}:</strong> {watch('email')}</p>
                   <p><strong>{t('phone')}:</strong> {watch('phone')}</p>
                </div>

                <div className="review-section">
                   <h4>Job</h4>
                   <p><strong>{t('department')}:</strong> {watch('department')}</p>
                   <p><strong>{t('role')}:</strong> {watch('role')}</p>
                   <p><strong>{t('salary')}:</strong> {watch('salary')}</p>
                </div>

                <div className="review-section">
                   <h4>Skills</h4>
                   <div className="chips-area">
                       {(watch('skills') || []).map(s => <span key={s} className="chip" style={{padding:'2px 8px', fontSize:'0.8em'}}>{s}</span>)}
                   </div>
                </div>

                {/* Internal Mail Checkbox */}
                <div className="form-field">
                   <label className="radio-label">
                      <input type="checkbox" {...register('internalMail')} /> {t('internalMail')}
                   </label>
                </div>
            </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="nav-buttons">
            <div>
                {currentStep > 1 && (
                    <button type="button" className="btn-secondary" onClick={handleBack}>
                        {t('back')}
                    </button>
                )}
            </div>

            <div className="button-group">
                {currentStep < totalSteps ? (
                    <button type="button" className="btn-primary" onClick={handleNext}>
                        {t('next')}
                    </button>
                ) : (
                    <>
                        <button 
                            type="button" 
                            className="btn-secondary" 
                            onClick={() => window.print()}
                        >
                            🖨️ {t('print')}
                        </button>

                        <button type="button" className="btn-draft" onClick={onSaveDraft} disabled={isApproved}>
                            {t('saveDraft')}
                        </button>
                        
                        <button type="submit" className="btn-primary" disabled={isApproved}>
                            {isApproved ? "Locked" : t('submitApproval')}
                        </button>
                    </>
                )}
            </div>
        </div>

      </form>
    </div>
  );
};

export default EmployeeForm;