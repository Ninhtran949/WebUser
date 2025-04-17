import React, { useState, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  phoneNumber: string; // thay email bằng phoneNumber
  address: string; // thêm trường address
  strUriAvatar?: string; // thêm avatar, optional
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>; // thêm function signup
  logout: () => void;
}

interface SignupData {
  name: string;
  phoneNumber: string;
  password: string;
  address: string;
  strUriAvatar?: string;
}

// Thêm interface cho response login
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/user/login`, {
        username: phoneNumber, // backend expects username as phoneNumber
        password,
      });

      const { accessToken, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('accessToken', accessToken);
      
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
      await axios.post<SignupResponse>(`${API_URL}/user/signup`, {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
      });

      // Auto login after successful signup
      await login(userData.phoneNumber, userData.password);
      
      // Không return response.data nữa
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post(`${API_URL}/user/logout`, { refreshToken });
      
      // Clear storage and state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken'); 
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <AuthContext.Provider value={{
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};