import { message } from 'antd';
import { useState, useEffect } from 'react';
import { Movie } from '../../interface/movie.interface';
import { searchMovieUrl } from '..';
import { axiosInstanceTMDB } from '../index';

export const useSearchMovie = (query: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await axiosInstanceTMDB.get(searchMovieUrl, {
          params: {
            query,
          },
        });

        if (response.data.results) {
          setMovies(response.data.results);
        }
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).response?.data?.message ||
          'Failed to search movies. Please try again!';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return { movies, loading };
};
