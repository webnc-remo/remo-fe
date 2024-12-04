import { message } from 'antd';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { axiosInstance } from '../index';
import { registerUrl } from '..';
import { User } from '../../interface/user.interface';

interface RegisterParams {
  email: string;
  password: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const register = async (params: RegisterParams) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<RegisterResponse>(
        registerUrl,
        params
      );

      const { accessToken, refreshToken, user } = response.data;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        setUser(user);
        message.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
