import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getUserUrl } from '..';
import { User } from '../../interface/user.interface';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const useGetUserProfile = () => {
  const navigate = useNavigate();
  const { clearTokens } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<User>(getUserUrl);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.status === 401) {
          clearTokens();
          navigate('/login');
        }
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!localStorage.getItem('accessToken'),
  });

  return {
    profile: data,
    loading: isLoading,
    refetch,
  };
};
