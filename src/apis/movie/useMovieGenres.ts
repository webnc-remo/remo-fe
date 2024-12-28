import { useEffect, useState } from 'react';
import { axiosInstance, movieGenresUrl } from '..';
import { Genre } from '../../interface/movie.interface';
import { message } from 'antd';

export const useMovieGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosInstance.get(movieGenresUrl);
        if (response.data?.items) {
          setGenres(response.data?.items);
        }
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.response?.data?.message ||
          'Failed to fetch genres. Please try again.';
        message.error(errorMessage);
      }
    };

    fetchGenres();
  }, []);

  return { genres };
};
