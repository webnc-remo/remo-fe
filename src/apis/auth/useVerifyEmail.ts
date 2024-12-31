import { message } from 'antd';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { axiosInstance, verifyEmailUrl } from '../index';

interface VerifyEmailParams {
  code: string;
}

interface VerifyEmailResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
  };
}

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);

  const verifyEmail = async (params: VerifyEmailParams) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<VerifyEmailResponse>(
        verifyEmailUrl,
        params
      );

      const { accessToken, refreshToken, user } = response.data;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken, user.isVerified);
        message.success('Email verified successfully!');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).message || 'Verification failed. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verifyEmail, loading };
};
