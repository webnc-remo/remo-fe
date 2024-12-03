import { message } from 'antd';
import { useState } from 'react';
import { loginUrl } from '..';
import { useAuthStore } from '../../stores/authStore';
import { axiosInstance } from '../index';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);

  const login = async (params: LoginParams) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<LoginResponse>(
        loginUrl,
        params
      );
      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        message.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
