import { useQuery } from '@tanstack/react-query';
import { axiosInstance, checkUserFavMovieUrl } from '..';

interface CheckFavoriteResponse {
  isFavorite: boolean;
}

export const useCheckUserFavMovie = (
  movieId: string | undefined,
  options: { enabled: boolean }
) => {
  const { data, isLoading, refetch } = useQuery<CheckFavoriteResponse>({
    queryKey: ['checkFavorite', movieId],
    queryFn: async () => {
      if (!movieId) throw new Error('Movie ID is required');
      const response = await axiosInstance.get(checkUserFavMovieUrl(movieId));
      return response.data;
    },
    enabled: options.enabled,
    retry: false,
  });

  return {
    isFavorite: data?.isFavorite || false,
    loading: isLoading,
    refetch,
  };
};
