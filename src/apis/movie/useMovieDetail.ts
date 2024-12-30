import { message } from 'antd';
import { useState, useEffect } from 'react';
import { Movie } from '../../interface/movie.interface';
import { axiosInstance, getMovieDetailUrl } from '..';

interface MovieDetailResponse {
  item: Movie;
}

export const useMovieDetail = (movieId: string) => {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!movieId) return;

      setLoading(true);
      try {
        const url = getMovieDetailUrl(movieId);
        const response = await axiosInstance.get<MovieDetailResponse>(url);

        if (response.data) {
          setMovie(response.data.item);
        }
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).message ||
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
