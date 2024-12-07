import { useEffect, useState } from 'react';
import { Movie } from '../../interface/movie.interface';
import { message } from 'antd';
import { axiosInstanceTMDB } from '../index';
import { getTrendingMovieUrl } from '..';

export const useGetTrendingMovie = (timeWindow: 'day' | 'week') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      try {
        const url = getTrendingMovieUrl(timeWindow);
        const response = await axiosInstanceTMDB.get(url);

        if (response.data.results) {
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
