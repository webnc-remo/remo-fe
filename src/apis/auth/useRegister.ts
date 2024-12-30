import { message } from 'antd';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { axiosInstance } from '../index';
import { registerUrl } from '..';

interface RegisterParams {
  email: string;
  password: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
  };
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);

  const register = async (params: RegisterParams) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<RegisterResponse>(
        registerUrl,
        params
      );

      const { accessToken, refreshToken, user } = response.data;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken, user.isVerified);
        message.success('Registration successful! Please verify your email.');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).message || 'Registration failed. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
