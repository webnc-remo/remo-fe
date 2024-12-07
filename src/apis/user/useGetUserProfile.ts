import { message } from 'antd';
import { axiosInstance } from '../index';
import { getUserUrl } from '..';

interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
}

export const useGetUserProfile = () => {
  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get<UserProfileResponse>(getUserUrl);

      const { email, avatar } = response.data;

      return { email, avatar };
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message ||
        'Failed to get user profile. Please try again!';
      message.error(errorMessage);
      return null;
    }
  };

  return { getUserProfile };
};
