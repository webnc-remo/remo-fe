import { useEffect, useState } from 'react';
import { Movie } from '../../interface/movie.interface';
import { message } from 'antd';
import { axiosInstance, getMoviePopularUrl } from '..';

export class GetPopularMovies {
  results!: Movie[];
}

export const useGetPopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const response =
          await axiosInstance.get<GetPopularMovies>(getMoviePopularUrl);

        if (response.data) {
          setMovies(response.data.results);
        }
      } catch (err) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).message || 'Failed to fetch popular movies.';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return { movies, loading };
};
