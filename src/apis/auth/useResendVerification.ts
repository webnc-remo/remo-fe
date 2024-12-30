import { message } from 'antd';
import { useState } from 'react';
import { axiosInstance, resendVerifyEmailUrl } from '../index';

export const useResendVerification = () => {
  const [loading, setLoading] = useState(false);

  const resendVerification = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(resendVerifyEmailUrl);
      message.success('Verification code has been resent to your email!');
      return true;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).message ||
        'Failed to resend verification code. Please try again!';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resendVerification, loading };
};
