import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { axiosInstance, getUserFavMovieUrl, UserFavMovieParam } from '..';
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

export const useGetUserFavMovie = (userFavMovieParam: UserFavMovieParam) => {
  const { data, isLoading, refetch } = useQuery<MoviesResponse>({
    queryKey: [
      'favoriteMovies',
      userFavMovieParam.page,
      userFavMovieParam.take,
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          getUserFavMovieUrl(userFavMovieParam)
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.response?.data?.message ||
          'Failed to fetch movies. Please try again.';
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
