import React, { useState, useEffect } from 'react'
import {
  XIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  InfoIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

interface SignInDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface ValidationErrors {
  name?: string;
  phoneNumber?: string;
  password?: string;
  address?: string;
}

const SignInDialog = ({ isOpen, onClose }: SignInDialogProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    address: '',
    strUriAvatar: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const { login, signup } = useAuth()
  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset error when user starts typing
    setError('');
    
    // Validate field immediately after typing
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // Validate specific field only
    validateField(name, updatedFormData);
  };

  // Add new function to validate individual fields
  const validateField = (fieldName: string, data = formData) => {
    const errors = { ...validationErrors };
    
    switch (fieldName) {
      case 'name':
        if (isSignup && (!data.name || data.name.trim().length < 2)) {
          errors.name = 'Tên phải có ít nhất 2 ký tự';
        } else {
          delete errors.name;
        }
        break;
        
      case 'address':
        if (isSignup && (!data.address || data.address.trim().length < 5)) {
          errors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
        } else {
          delete errors.address;
        }
        break;
        
      case 'phoneNumber':
        const phoneRegex = /^(0|84|\+84)[35789][0-9]{8}$/;
        if (!phoneRegex.test(data.phoneNumber)) {
          errors.phoneNumber = 'Số điện thoại không hợp lệ (VD: 0912345678)';
        } else {
          delete errors.phoneNumber;
        }
        break;
        
      case 'password':
        const passwordErrors = [];
        if (data.password.length < 6) passwordErrors.push('tối thiểu 6 ký tự');
        if (!/[A-Z]/.test(data.password)) passwordErrors.push('1 chữ hoa');
        if (!/[a-z]/.test(data.password)) passwordErrors.push('1 chữ thường');
        if (!/\d/.test(data.password)) passwordErrors.push('1 số');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) passwordErrors.push('1 ký tự đặc biệt');
        
        if (passwordErrors.length > 0) {
          errors.password = `Mật khẩu phải có: ${passwordErrors.join(', ')}`;
        } else {
          delete errors.password;
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modify validateForm to use validateField for each field
  const validateForm = () => {
    let isValid = true;
    
    if (isSignup) {
      isValid = validateField('name') && isValid;
      isValid = validateField('address') && isValid;
    }
    
    isValid = validateField('phoneNumber') && isValid;
    isValid = validateField('password') && isValid;
    
    return isValid;
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        await signup(formData);
        showToast('success', 'Đăng ký thành công!');
      } else {
        await login(formData.phoneNumber, formData.password);
        showToast('success', 'Đăng nhập thành công!');
      }
      onClose();
    } catch (err: any) {
      if (err?.response?.data?.message === 'Phone number already exists') {
        showToast('error', 'Số điện thoại đã được đăng ký');
      } else {
        showToast('error', isSignup ? 'Đăng ký thất bại' : 'Thông tin đăng nhập không chính xác');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = Object.keys(validationErrors).length === 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full max-w-md relative shadow-2xl transform transition-all">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-4 p-4 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white`}
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon size={20} />
            ) : (
              <AlertCircleIcon size={20} />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={t('auth.close')}
        >
          <XIcon size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            {t(isSignup ? 'auth.createAccount' : 'auth.signIn')}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <>
                <div className="relative">
                  <UserIcon
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder={t('auth.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => validateField('name')}
                    required={isSignup}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.name && (
                    <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <InfoIcon size={14} />
                      <span>{validationErrors.name}</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <MapPinIcon
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder={t('auth.addressPlaceholder')}
                    value={formData.address}
                    onChange={handleInputChange}
                    required={isSignup}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      validationErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.address && (
                    <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <InfoIcon size={14} />
                      <span>{validationErrors.address}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="relative">
              <PhoneIcon
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder={t('auth.phonePlaceholder')}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                  validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.phoneNumber && (
                <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <InfoIcon size={14} />
                  <span>{validationErrors.phoneNumber}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                required
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                aria-label={t(
                  showPassword ? 'auth.hidePassword' : 'auth.showPassword',
                )}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
              {validationErrors.password && (
                <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <InfoIcon size={14} />
                  <span>{validationErrors.password}</span>
                </div>
              )}
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 transition-colors"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                    {t('auth.rememberMe')}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-800 hover:text-blue-900 hover:underline transition-colors"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                !isFormValid || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-800 text-white hover:bg-blue-900'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {t(isSignup ? 'auth.creatingAccount' : 'auth.signingIn')}
                </div>
              ) : (
                t(isSignup ? 'auth.createAccount' : 'auth.signIn')
              )}
            </button>
          </form>

          <button
            type="button"
            className="mt-6 text-blue-800 hover:text-blue-900 hover:underline text-sm font-medium transition-colors w-full text-center"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setValidationErrors({});
              setFormData({
                name: '',
                phoneNumber: '',
                password: '',
                address: '',
                strUriAvatar: '',
              });
            }}
          >
            {t(isSignup ? 'auth.alreadyHaveAccount' : 'auth.needAccount')}
          </button>

          <p className="mt-6 text-sm text-gray-500 text-center">
            {t('auth.termsText')}{' '}
            <a
              href="#"
              className="text-blue-800 hover:text-blue-900 hover:underline"
            >
              {t('auth.termsOfUse')}
            </a>{' '}
            {t('auth.andText')}{' '}
            <a
              href="#"
              className="text-blue-800 hover:text-blue-900 hover:underline"
            >
              {t('auth.privacyPolicy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInDialog;
