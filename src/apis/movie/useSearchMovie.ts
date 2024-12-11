import { message } from 'antd';
import { useState, useEffect } from 'react';
import { Movie } from '../../interface/movie.interface';
import { searchMovieUrl } from '..';
import { axiosInstanceTMDB } from '../index';

export const useSearchMovie = (query: string, initialPage: number) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await axiosInstanceTMDB.get(searchMovieUrl, {
          params: {
            query,
            page: currentPage,
          },
        });

        if (response.data.results) {
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages);
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
  }, [query, currentPage]);

  return { movies, loading, totalPages, currentPage, setCurrentPage };
};