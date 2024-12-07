import { message } from 'antd';
import { useState } from 'react';
import { logoutUrl } from '..';
import { axiosInstance } from '../index';
import { useAuthStore } from '../../stores/authStore';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axiosInstance.post(logoutUrl, { refreshToken });

      useAuthStore.getState().clearTokens();

      return true;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message ||
        'Login failed. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
