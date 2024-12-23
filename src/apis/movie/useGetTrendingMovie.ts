import { useEffect, useState } from 'react';
import { Movie } from '../../interface/movie.interface';
import { message } from 'antd';
import { axiosInstance, getTrendingMovieUrl } from '..';

export class GetTrendingMovie {
  results!: Movie[];
}

export const useGetTrendingMovie = (timeWindow: 'day' | 'week') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      try {
        const url = getTrendingMovieUrl(timeWindow);
        const response = await axiosInstance.get<GetTrendingMovie>(url);

        console.log('res', response);
        if (response.data) {
          setMovies(response.data.results);
        }
      } catch (err) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).response?.data?.message ||
          'Failed to fetch trending movies.';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [timeWindow]);

  return { movies, loading };
};
