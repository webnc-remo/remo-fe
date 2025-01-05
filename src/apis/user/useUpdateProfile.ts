import { useState } from 'react';
import { message } from 'antd';
import { axiosInstance, updateUserUrl } from '..';

interface UpdateProfileParams {
  fullName: string;
}

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (params: UpdateProfileParams) => {
    try {
      setLoading(true);
      await axiosInstance.patch(updateUserUrl, params);
      message.success('Profile updated successfully');
      return true;
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.message || 'Failed to update profile';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};
