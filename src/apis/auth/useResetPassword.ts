import { message } from 'antd';
import { useState } from 'react';
import {
  axiosInstance,
  resetPasswordUrl,
  verifyResetPasswordUrl,
} from '../index';
import { ErrorResponse } from '../../interface/error-response.interface';

interface ResetPasswordParams {
  newPassword: string;
  token: string;
}

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (params: ResetPasswordParams) => {
    try {
      setLoading(true);
      await axiosInstance.post(resetPasswordUrl(params.token), {
        newPassword: params.newPassword,
      });
      message.success('Password has been reset successfully. Please login.');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      message.error(
        errorResponse?.message || 'Failed to reset password. Please try again!'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await axiosInstance.get(verifyResetPasswordUrl(token));
      if (response.data) {
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).message || 'Invalid or expired reset token';
      message.error(errorMessage);
      return false;
    }
  };

  return { resetPassword, verifyToken, loading };
};
