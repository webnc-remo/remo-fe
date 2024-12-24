import { useMutation } from '@tanstack/react-query';
import { axiosInstance, toggleFavoriteUrl } from '../index';

export const useToggleFavorite = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ['toggleFavorite'],
    mutationFn: async (movieId: string) => {
      const response = await axiosInstance.get(toggleFavoriteUrl(movieId));
      return response.data;
    },
  });

  return {
    toggleFavorite: mutate,
    loading: isPending,
  };
};
