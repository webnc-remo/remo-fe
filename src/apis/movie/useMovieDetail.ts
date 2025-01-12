import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getMovieDetailUrl } from '..';
import { Movie } from '../../interface/movie.interface';

interface MovieDetailResponse {
  item: Movie;
}

export const useMovieDetail = (movieId: string) => {
  const { data, isLoading, refetch } = useQuery<MovieDetailResponse>({
    queryKey: ['movieDetail', movieId],
    queryFn: async () => {
      const response = await axiosInstance.get(getMovieDetailUrl(movieId));
      return response.data;
    },
    enabled: !!movieId,
  });

  return {
    movie: data?.item,
    loading: isLoading,
    refetch,
  };
};
