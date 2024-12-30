import { message } from 'antd';
import { axiosInstance } from '../index';
import { getUserUrl } from '..';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface UserProfileResponse {
  id: string;
  email: string;
  avatar: string;
}

export const useGetUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isVerified = useAuthStore((state) => state.isVerified);

  useEffect(() => {
    const getUserProfile = async () => {
      if (!isAuthenticated || !isVerified) {
        return null;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(getUserUrl);
        if (response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        message.error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).message ||
            'Failed to get user profile. Please try again!'
        );
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [isAuthenticated, isVerified]);

  return { profile, loading };
};
