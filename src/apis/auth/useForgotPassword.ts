import { message } from 'antd';
import { useState } from 'react';
import { axiosInstance, forgotPasswordUrl } from '../index';
import { ErrorResponse } from '../../interface/error-response.interface';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      message.error(
        errorResponse?.message || 'Failed to process request. Please try again!'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
};
