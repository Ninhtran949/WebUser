import React, { useState } from 'react';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'OTP sending failed' });
        setIsLoading(false);
        return;
      }
      setStep('otp');
      setMessage({ type: 'success', text: 'OTP đã được gửi tới email của bạn.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gửi OTP thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'OTP không đúng' });
        setIsLoading(false);
        return;
      }
      setStep('reset');
      setMessage({ type: 'success', text: 'Xác thực OTP thành công. Hãy đặt mật khẩu mới.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Xác thực OTP thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }
    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Đổi mật khẩu thất bại' });
        setIsLoading(false);
        return;
      }
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Đổi mật khẩu thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md relative shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Forgot Password?</h2>
        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>
        )}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Enter your account email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP code'}
            </button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nhập mã OTP</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded" disabled={isLoading}>
              {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>
          </form>
        )}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border rounded px-3 py-2"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full border rounded px-3 py-2"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowConfirmPassword(v => !v)}>
                  {showConfirmPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded" disabled={isLoading}>
              {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;
