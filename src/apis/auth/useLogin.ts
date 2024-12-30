import { message } from 'antd';
import { useState } from 'react';
import { loginUrl } from '..';
import { useAuthStore } from '../../stores/authStore';
import { axiosInstance } from '../index';
import { User } from '../../interface/user.interface';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const login = async (params: LoginParams) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<LoginResponse>(
        loginUrl,
        params
      );

      const { accessToken, refreshToken, user } = response.data;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken, user.isVerified);
        setUser(user);

        if (!user.isVerified) {
          message.info('Please verify your email to continue.');
          return false;
        } else {
          message.success('Login successful!');
        }
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

  return { login, loading };
};
