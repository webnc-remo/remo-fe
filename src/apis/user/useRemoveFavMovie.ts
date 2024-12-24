import { useMutation } from '@tanstack/react-query';
import { axiosInstance, removeUserFavMovieUrl } from '../index';

export const useRemoveFavMovie = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ['removeFavMovie'],
    mutationFn: async (movieId: string) => {
      const response = await axiosInstance.delete(
        removeUserFavMovieUrl(movieId)
      );
      return response.data;
    },
  });

  return {
    removeFavMovie: mutate,
    loading: isPending,
  };
};
