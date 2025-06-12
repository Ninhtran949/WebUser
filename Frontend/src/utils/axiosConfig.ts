import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response type
interface TokenResponse {
  accessToken: string;
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<TokenResponse>(`${API_URL}/user/token/refresh`); 
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (error) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;