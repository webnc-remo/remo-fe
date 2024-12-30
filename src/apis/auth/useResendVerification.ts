import { message } from 'antd';
import { useState } from 'react';
import { axiosInstance, resendVerifyEmailUrl } from '../index';
import { ErrorResponse } from '../../interface/error-response.interface';

export const useResendVerification = () => {
  const [loading, setLoading] = useState(false);

  const resendVerification = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(resendVerifyEmailUrl);
      message.success('Verification code has been resent to your email!');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      message.error(
        errorResponse?.message ||
          'Failed to resend verification code. Please try again!'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resendVerification, loading };
};
