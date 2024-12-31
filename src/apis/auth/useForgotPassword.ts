import { message } from 'antd';
import { useState } from 'react';
import { axiosInstance, forgotPasswordUrl } from '../index';

interface ForgotPasswordParams {
  email: string;
}

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (params: ForgotPasswordParams) => {
    try {
      setLoading(true);
      await axiosInstance.post(forgotPasswordUrl, params);
      message.success(
        'Password reset instructions have been sent to your email.'
      );
      return true;
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

  return { forgotPassword, loading };
};
