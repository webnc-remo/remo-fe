import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getUserUrl } from '..';
import { User } from '../../interface/user.interface';

export const useGetUserProfile = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axiosInstance.get<User>(getUserUrl);
      return response.data;
    },
  });

  return {
    profile: data,
    loading: isLoading,
    refetch,
  };
};
