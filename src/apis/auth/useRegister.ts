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

      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        message.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message ||
        'Registration failed. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
