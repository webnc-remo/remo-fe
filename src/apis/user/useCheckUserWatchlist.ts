import { useQuery } from '@tanstack/react-query';
import { axiosInstance, checkUserWatchlistUrl } from '..';

export const useCheckUserWatchlist = (
  movieId: string,
  options: { enabled: boolean }
) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['check-watchlist', movieId],
    queryFn: async () => {
      if (!movieId) throw new Error('movieId is required');
      const response = await axiosInstance.get(checkUserWatchlistUrl(movieId));
      return response.data;
    },
    enabled: options.enabled,
    retry: false,
  });

  return {
    isWatchlist: data?.isWatchlist || false,
    loading: isLoading,
    refetch,
  };
};
