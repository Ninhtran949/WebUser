import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy accessToken từ URL
function getAccessTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('accessToken');
}

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      // Gọi checkAuth để đồng bộ user context
      checkAuth().then(() => {
        // Có thể redirect về trang chủ hoặc trang account
        navigate('/account/profile');
      });
    } else {
      // Không có token, về trang login
      navigate('/login');
    }
  }, [checkAuth, navigate]);

  return <div>Đang đăng nhập, vui lòng chờ...</div>;
};

export default OAuthSuccess;