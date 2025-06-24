import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Lấy accessToken từ URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      // Gọi checkAuth để lấy user info
      checkAuth().then(() => {
        navigate('/');
      });
    } else {
      // Không có token, về trang login
      navigate('/login');
    }
  }, []);

  return <div>Đang đăng nhập, vui lòng chờ...</div>;
};

export default OAuthSuccess;