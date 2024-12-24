import { useMutation } from '@tanstack/react-query';
import { axiosInstance, removeUserFavMovieUrl, toggleFavoriteUrl } from '..';

export const useToggleFavorite = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      movieId,
      action,
    }: {
      movieId: string;
      action: 'add' | 'remove';
    }) => {
      if (action === 'add') {
        const response = await axiosInstance.get(toggleFavoriteUrl(movieId));
        return response.data;
      } else {
        const response = await axiosInstance.delete(
          removeUserFavMovieUrl(movieId)
        );
        return response.data;
      }
    },
  });

  return {
    toggleFavorite: mutate,
    loading: isPending,
  };
};
