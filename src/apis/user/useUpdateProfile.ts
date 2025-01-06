import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { axiosInstance, updateUserUrl } from '..';
import { USER_PROFILE_QUERY_KEY } from './useGetUserProfile';

interface UpdateProfileParams {
  fullName: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateProfileParams) => {
      const response = await axiosInstance.patch(updateUserUrl, params);
      return response.data;
    },
    onSuccess: () => {
      message.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to update profile';
      message.error(errorMessage);
    },
  });
};
