import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NumericFormat } from 'react-number-format';
import { IMaskInput } from 'react-imask';
import './SecondHalf.css';

// --- 1. I18n Dictionary ---
const translations = {
  vi: {
    title: "Thông tin nhân viên",
    fullName: "Họ và tên",
    gender: "Giới tính",
    male: "Nam",
    female: "Nữ",
    dob: "Ngày sinh",
    nationality: "Quốc tịch",
    selectNationality: "Chọn quốc tịch",
    address: "Địa chỉ thường trú",
    phone: "Số điện thoại",
    email: "Email công việc",
    department: "Phòng ban",
    selectDepartment: "Chọn phòng ban",
    role: "Vai trò",
    selectRole: "Chọn vai trò",
    contractType: "Loại hợp đồng",
    selectContract: "Chọn loại hợp đồng",
    salary: "Mức lương",
    maritalStatus: "Tình trạng hôn nhân",
    selectMarital: "Chọn tình trạng",
    single: "Độc thân",
    married: "Đã kết hôn",
    skills: "Kỹ năng (phân cách bằng dấu phẩy)",
    internalMail: "Nhận mail nội bộ",
    isActive: "Trạng thái kích hoạt",
    active: "Đã kích hoạt",
    inactive: "Chưa kích hoạt",
    profilePic: "Ảnh đại diện",
    saveDraft: "Lưu nháp",
    submitApproval: "Gửi duyệt",
    print: "In biểu mẫu",
    status: "Trạng thái hồ sơ",
    // Errors
    errRequired: "Trường này là bắt buộc",
    errMin5: "Phải có ít nhất 5 ký tự",
    errPhone: "Số điện thoại không hợp lệ (10-11 số)",
    errEmail: "Email không hợp lệ",
    errSalary: "Lương không được âm",
    errGender: "Vui lòng chọn giới tính",
  },
  en: {
    title: "Employee Information",
    fullName: "Full Name",
    gender: "Gender",
    male: "Male",
    female: "Female",
    dob: "Date of Birth",
    nationality: "Nationality",
    selectNationality: "Select Nationality",
    address: "Permanent Address",
    phone: "Phone Number",
    email: "Work Email",
    department: "Department",
    selectDepartment: "Select Department",
    role: "Role",
    selectRole: "Select Role",
    contractType: "Contract Type",
    selectContract: "Select Contract",
    salary: "Salary",
    maritalStatus: "Marital Status",
    selectMarital: "Select Status",
    single: "Single",
    married: "Married",
    skills: "Skills (comma separated)",
    internalMail: "Receive Internal Mail",
    isActive: "Active Status",
    active: "Active",
    inactive: "Inactive",
    profilePic: "Profile Picture",
    saveDraft: "Save as Draft",
    submitApproval: "Submit for Approval",
    print: "Print Form",
    status: "Profile Status",
    // Errors
    errRequired: "This field is required",
    errMin5: "Must be at least 5 characters",
    errPhone: "Invalid phone number (10-11 digits)",
    errEmail: "Invalid email",
    errSalary: "Salary cannot be negative",
    errGender: "Please select a gender",
  }
};

const mockRoles = ['Developer', 'Manager', 'Analyst', 'Associate'];
const mockContractTypes = ['Full-time', 'Part-time', 'Intern'];
const defaultProfilePicture = 'https://via.placeholder.com/150';

const EmployeeForm = () => {
  const [lang, setLang] = useState('vi'); // 'vi' | 'en'
  const [formStatus, setFormStatus] = useState('Draft'); // 'Draft' | 'Pending' | 'Approved'
  
  const t = (key) => translations[lang][key] || key;
  const isApproved = formStatus === 'Approved';

  // --- 2. Dynamic Zod Schema (Memoized for i18n) ---
  const employeeSchema = useMemo(() => z.object({
    fullName: z.string().min(1, t('errRequired')),
    gender: z.enum(["Male", "Female"], { errorMap: () => ({ message: t('errGender') }) }),
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
    contractType: z.string().min(1, t('errRequired')),
    salary: z.preprocess(
      (val) => Number(String(val).replace(/,/g, '')),
      z.number().min(0, t('errSalary'))
    ),
    maritalStatus: z.string().optional(),
    internalMail: z.boolean(),
    isActive: z.boolean(),
    skills: z.string(),
    profilePicture: z.any().optional(),
  }), [lang]); // Re-create schema when lang changes

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: 'onSubmit', // Only validate strictly on submit
    defaultValues: {
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
      skills: '',
      isActive: true,
    },
  });

  const profilePictureFile = watch('profilePicture');

  const getPreviewUrl = () => {
    if (profilePictureFile && profilePictureFile.length > 0) {
      return URL.createObjectURL(profilePictureFile[0]);
    }
    return defaultProfilePicture;
  };

  // --- 3. Handlers: Draft vs Approval ---

  // Action: Save as Draft (Bypasses strict validation)
  const handleSaveDraft = () => {
    const data = getValues(); // Get raw data without validation
    
    // Transform data for API if needed
    const formattedData = {
      ...data,
      status: 'Draft',
      skills: data.skills.split(',').map(s => s.trim()).filter(s => s),
    };

    setFormStatus('Draft');
    console.log("💾 Draft Saved:", formattedData);
    alert(`Saved as Draft! (Lang: ${lang})`);
  };

  // Action: Submit for Approval (Triggered by handleSubmit -> Strict Validation)
  const onSubmitApproval = (data) => {
    const formattedData = {
      ...data,
      status: 'Pending', // Transition to Pending
      skills: data.skills.split(',').map(s => s.trim()).filter(s => s),
      profilePicture: data.profilePicture?.[0] || null
    };

    setFormStatus('Pending');
    console.log("🚀 Submitted for Approval:", formattedData);
    
    // Mock: Auto-approve after 2 seconds to test "Locked" state
    setTimeout(() => {
        if(window.confirm("Simulate HR Manager approving this form?")) {
            setFormStatus('Approved');
        }
    }, 1000);
  };

  const renderOptions = (options) => options.map(opt => <option key={opt} value={opt}>{opt}</option>);

  // Helper for Accessibility error attributes
  const getAriaProps = (fieldName) => ({
    "aria-invalid": errors[fieldName] ? "true" : "false",
    "aria-describedby": errors[fieldName] ? `${fieldName}-error` : undefined
  });

  return (
    <div className="form-container">
        {/* Top Bar: Language & Status */}
        <div className="form-header">
            <div className="status-badge">
                <strong>{t('status')}: </strong> 
                <span className={`badge ${formStatus.toLowerCase()}`}>{formStatus}</span>
            </div>
            <button type="button" onClick={() => setLang(l => l === 'vi' ? 'en' : 'vi')}>
                🌐 {lang === 'vi' ? 'English' : 'Tiếng Việt'}
            </button>
        </div>

        {/* Form Starts */}
        <form onSubmit={handleSubmit(onSubmitApproval)} className="employee-form">
        
        <h2>{t('title')}</h2>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
            <div className="error-summary" role="alert" aria-live="assertive">
            <ul>
                {Object.entries(errors).map(([key, val]) => (
                <li key={key}>
                    <a href={`#${key}`}>{val.message}</a>
                </li>
                ))}
            </ul>
            </div>
        )}

        {/* Profile Picture */}
        <div className="form-field">
            <label htmlFor="profilePicture">{t('profilePic')}</label>
            <div>
                <img src={getPreviewUrl()} alt="Profile Preview" className="profile-picture-preview" />
                <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    {...register('profilePicture')}
                    {...getAriaProps('profilePicture')}
                />
            </div>
        </div>

        {/* Full Name */}
        <div className="form-field">
            <label htmlFor="fullName">{t('fullName')} <span className="required">*</span></label>
            <input id="fullName" type="text" {...register('fullName')} {...getAriaProps('fullName')} />
            {errors.fullName && <span id="fullName-error" className="error-msg">{errors.fullName.message}</span>}
        </div>
        
        {/* Gender*/}
        <fieldset className="form-field">
            <legend>{t('gender')} <span className="required">*</span></legend>
            <div className="radio-group">
                <label className="radio-label">
                    <input type="radio" value="Male" {...register('gender')} aria-invalid={!!errors.gender} />
                    {t('male')}
                </label>
                <br></br>
                <label className="radio-label">
                    <input type="radio" value="Female" {...register('gender')} aria-invalid={!!errors.gender} />
                    {t('female')}
                </label>
            </div>
            {errors.gender && <span className="error-msg">{errors.gender.message}</span>}
        </fieldset>
        
        {/* DOB */}
        <div className="form-field">
            <label htmlFor="dob">{t('dob')} <span className="required">*</span></label>
            <input id="dob" type="date" {...register('dob')} {...getAriaProps('dob')} />
            {errors.dob && <span id="dob-error" className="error-msg">{errors.dob.message}</span>}
        </div>
        
        {/* Nationality */}
        <div className="form-field">
            <label htmlFor="nationality">{t('nationality')} <span className="required">*</span></label>
            <select id="nationality" {...register('nationality')} {...getAriaProps('nationality')}>
            <option value="">{t('selectNationality')}</option>
            <option value="Vietnamese">Vietnam</option>
            <option value="American">USA</option>
            <option value="Japanese">Japan</option>
            </select>
            {errors.nationality && <span id="nationality-error" className="error-msg">{errors.nationality.message}</span>}
        </div>
        
        {/* Address */}
        <div className="form-field">
            <label htmlFor="address">{t('address')} <span className="required">*</span></label>
            <textarea id="address" {...register('address')} {...getAriaProps('address')}></textarea>
            {errors.address && <span id="address-error" className="error-msg">{errors.address.message}</span>}
        </div>
        
        {/* Phone */}
        <div className="form-field">
            <label htmlFor="phone">{t('phone')} <span className="required">*</span></label>
            <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
                <IMaskInput
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
        
        {/* Email */}
        <div className="form-field">
            <label htmlFor="email">{t('email')} <span className="required">*</span></label>
            <input id="email" type="email" {...register('email')} {...getAriaProps('email')} />
            {errors.email && <span id="email-error" className="error-msg">{errors.email.message}</span>}
        </div>
        
        {/* Department */}
        <div className="form-field">
            <label htmlFor="department">{t('department')} <span className="required">*</span></label>
            <select id="department" {...register('department')} {...getAriaProps('department')}>
            <option value="">{t('selectDepartment')}</option>
            <option value="HR">Human Resources</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            </select>
            {errors.department && <span id="department-error" className="error-msg">{errors.department.message}</span>}
        </div>
        
        {/* Role */}
        <div className="form-field">
            <label htmlFor="role">{t('role')} <span className="required">*</span></label>
            <select id="role" {...register('role')} {...getAriaProps('role')}>
                <option value="">{t('selectRole')}</option>
                {renderOptions(mockRoles)}
            </select>
            {errors.role && <span id="role-error" className="error-msg">{errors.role.message}</span>}
        </div>
        
        {/* Contract Type */}
        <div className="form-field">
            <label htmlFor="contractType">{t('contractType')} <span className="required">*</span></label>
            <select id="contractType" {...register('contractType')} {...getAriaProps('contractType')}>
                <option value="">{t('selectContract')}</option>
                {renderOptions(mockContractTypes)}
            </select>
            {errors.contractType && <span id="contractType-error" className="error-msg">{errors.contractType.message}</span>}
        </div>
        
        {/* Salary - LOCKED IF APPROVED */}
        <div className="form-field">
            <label htmlFor="salary">
                {t('salary')} <span className="required">*</span>
                {isApproved && <span title="Locked by HR">🔒</span>}
            </label>
            <Controller
            name="salary"
            control={control}
            render={({ field: { onChange, value, name } }) => (
                <NumericFormat
                id="salary"
                thousandSeparator=","
                decimalSeparator="."
                suffix=" ₫"
                value={value}
                // Lock the input if status is Approved
                disabled={isApproved} 
                onValueChange={(v) => onChange(v.value)}
                name={name}
                placeholder="0 ₫"
                aria-invalid={!!errors.salary}
                aria-describedby={errors.salary ? "salary-error" : undefined}
                className={isApproved ? 'input-disabled' : ''}
                />
            )}
            />
            {errors.salary && <span id="salary-error" className="error-msg">{errors.salary.message}</span>}
        </div>
        
        {/* Marital Status */}
        <div className="form-field">
            <label htmlFor="maritalStatus">{t('maritalStatus')}</label>
            <select id="maritalStatus" {...register('maritalStatus')}>
                <option value="">{t('selectMarital')}</option>
                <option value="single">{t('single')}</option>
                <option value="married">{t('married')}</option>
            </select>
        </div>
        
        {/* Skills */}
        <div className="form-field">
            <label htmlFor="skills">{t('skills')}</label>
            <input id="skills" type="text" placeholder="React, Node.js..." {...register('skills')} />
        </div>
        
        {/* Internal Mail */}
        <div className="form-field">
            <label className="checkbox-label">
                <input type="checkbox" {...register('internalMail')} />
                {t('internalMail')}
            </label>
        </div>

        {/* Active Switch */}
        <div className="form-field">
            <label>{t('isActive')}</label>
            <div className="switch-group"> 
                <label className="toggle-switch-container">
                <input type="checkbox" {...register('isActive')} />
                <span className="slider round"></span>
                </label>
                <b>{watch('isActive') ? t('active') : t('inactive')}</b>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
            <button type="button" className="btn-secondary" onClick={() => window.print()}>
                {t('print')}
            </button>
            
            {/* SAVE DRAFT: type="button" prevents Form Submit, calls custom handler */}
            <button type="button" className="btn-draft" onClick={handleSaveDraft} disabled={isApproved}>
                {t('saveDraft')}
            </button>
            
            {/* SUBMIT: type="submit" triggers React Hook Form validation */}
            <button type="submit" className="btn-primary" disabled={isApproved}>
                {isApproved ? "Locked (Approved)" : t('submitApproval')}
            </button>
        </div>
        </form>
    </div>
  );
};

export default EmployeeForm;