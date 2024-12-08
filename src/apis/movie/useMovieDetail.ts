import { message } from 'antd';
import { useState, useEffect } from 'react';
import { Movie } from '../../interface/movie.interface';
import { getMovieDetailUrl } from '..';
import { axiosInstanceTMDB } from '../index';

export const useMovieDetail = (movieId: string) => {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!movieId) return;

      setLoading(true);
      try {
        const url = getMovieDetailUrl(movieId);
        const response = await axiosInstanceTMDB.get(url);

        if (response.data) {
          setMovie(response.data);
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

    fetchMovieDetail();
  }, [movieId]);

  return { movie, loading };
};
