import { message } from 'antd';
import { useState, useEffect } from 'react';
import { Movie } from '../../interface/movie.interface';
import { axiosInstance, getSimilarMoviesUrl } from '..';

export class SimilarMoviesResponse {
    results!: Movie[];
}

export const useSimilarMovies = (movieId: string) => {
  const [loading, setLoading] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movieId) return;

      setLoading(true);
      try {
        const url = getSimilarMoviesUrl(movieId);
        const response = await axiosInstance.get<SimilarMoviesResponse>(url);

        if (response.data) {
          setSimilarMovies(response.data.results);
        }
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).message ||
          'Failed to fetch similar movies. Please try again!';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieId]);

  return { similarMovies, loading };
}; 