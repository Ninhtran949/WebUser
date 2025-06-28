import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  strUriAvatar?: string;
  email?: string;
  oauthProvider?: 'google' | 'facebook' | null;
  oauthId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  checkAuth: () => Promise<void>;
}

interface SignupData {
  name: string;
  phoneNumber: string;
  password: string;
  address: string;
  strUriAvatar?: string;
  email?: string;
  oauthProvider?: 'google' | 'facebook' | null;
  oauthId?: string;
}

// Thêm interface cho response login
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Thêm function để check authentication status
  const checkAuth = async () => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = sessionStorage.getItem('accessToken');
      }
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Set token vào header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Gọi API để verify token và lấy user info
      const response = await axios.get<User>(`${API_URL}/user/me`);
      console.log('User data from checkAuth:', response.data); // Log user data for debugging
      setUser(response.data);
    } catch (error) {
      // Nếu token invalid, clear localStorage và user state
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  // Chạy checkAuth khi component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (phoneNumber: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/user/login`, {
        username: phoneNumber,
        password,
      });

      const { accessToken, user: userData } = response.data;

      // Lưu accessToken vào localStorage nếu rememberMe, ngược lại lưu vào sessionStorage
      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        sessionStorage.removeItem('accessToken');
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.removeItem('accessToken');
      }
      
      // Log user data for debugging (especially for OAuth)
      console.log('User data after login:', userData);

      // Set user state
      setUser(userData);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  };
  // Thêm interface cho response signup
  interface SignupResponse {
    id: string;
    name: string;
    phoneNumber: string;
    address: string;
    strUriAvatar?: string;
  }
  const signup = async (userData: SignupData): Promise<void> => {
    try {
      // For OAuth signups
      if (userData.oauthProvider && userData.oauthId) {
        await axios.post<SignupResponse>(`${API_URL}/user/oauth/signup`, {
          ...userData,
          id: userData.email || userData.phoneNumber, // Use email for OAuth users if available
        });
        
        // For OAuth users, we'll need to handle authentication differently
        // This will be implemented in the OAuth flow
        return;
      }

      // For regular signups
      await axios.post<SignupResponse>(`${API_URL}/user/signup`, {
        ...userData,
        id: userData.phoneNumber, // Continue using phoneNumber as ID for regular users
      });

      // Auto login after successful signup (only for non-OAuth users)
      await login(userData.phoneNumber, userData.password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/user/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Cleanup local storage và state
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const loginWithFacebook = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <AuthContext.Provider value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        checkAuth // <-- thêm dòng này
      }}>
        {!loading && children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};