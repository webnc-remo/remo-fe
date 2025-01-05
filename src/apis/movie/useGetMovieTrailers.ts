import { useEffect, useState } from 'react';
import { Movie } from '../../interface/movie.interface';
import { message } from 'antd';
import { axiosInstance, getNowPlayingMovie } from '..';

export class GetMovieTrailers {
  results!: Movie[];
}

export const useGetMovieTrailers = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovieTrailers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<GetMovieTrailers>(getNowPlayingMovie);

        if (response.data) {
          setMovies(response.data.results);
        }
      } catch (err) {
        const errorMessage = 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).message || 'Failed to fetch movie trailers.';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieTrailers();
  }, []);

  return { movies, loading };
}; 