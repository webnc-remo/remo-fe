import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { axiosInstance, getUserWatchlistUrl, UserWatchlistParam } from '..';
import { Movie } from '../../interface/movie.interface';

interface MoviesResponse {
  items: Movie[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  list: {
    id: string;
    listName: string;
    createdAt: string;
    user: {
      fullname: string;
    };
  };
}

export const useGetUserWatchlist = (userWatchlistParam: UserWatchlistParam) => {
  const { data, isLoading, refetch } = useQuery<MoviesResponse>({
    queryKey: [
      'favoriteMovies',
      userWatchlistParam.page,
      userWatchlistParam.take,
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          getUserWatchlistUrl(userWatchlistParam)
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).message ||
          'Failed to fetch watchlist. Please try again.';
        message.error(errorMessage);
        throw error;
      }
    },
  });

  return {
    movies: data?.items || [],
    loading: isLoading,
    meta: data?.meta,
    listInfo: data?.list,
    refetch,
  };
};
