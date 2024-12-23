import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { axiosInstance, searchMovieUrl, SearchParam } from '..';
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
}

export const useSearchMovie = (query: SearchParam) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    page: query.page,
    take: query.take,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const prevQueryRef = useRef<SearchParam | null>(null);

  useEffect(() => {
    if (
      prevQueryRef.current &&
      JSON.stringify(prevQueryRef.current) === JSON.stringify(query)
    ) {
      return;
    }

    prevQueryRef.current = query;

    const searchMovies = async () => {
      setLoading(true);

      try {
        const url = searchMovieUrl(query);
        const response = await axiosInstance.get<MoviesResponse>(url);

        if (response.data) {
          setMovies(response.data.items);
          setMeta(response.data.meta);
        }
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.response?.data?.message ||
          'Failed to fetch movies. Please try again.';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return {
    movies,
    meta,
    loading,
  };
};
