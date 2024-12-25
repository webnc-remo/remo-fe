import { useMutation } from '@tanstack/react-query';
import { axiosInstance, removeUserWatchlistUrl, toggleWatchlistUrl } from '..';

export const useToggleWatchlist = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      movieId,
      action,
    }: {
      movieId: string;
      action: 'add' | 'remove';
    }) => {
      if (action === 'add') {
        const response = await axiosInstance.post(toggleWatchlistUrl(movieId));
        return response.data;
      } else {
        const response = await axiosInstance.delete(
          removeUserWatchlistUrl(movieId)
        );
        return response.data;
      }
    },
  });

  return {
    toggleWatchlist: mutate,
    loading: isPending,
  };
};
