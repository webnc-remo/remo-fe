import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getUserMovieRatingUrl } from '..';

interface UserRating {
  rating: number;
  review?: string;
}

export const useGetUserRating = (movieId: string) => {
  return useQuery({
    queryKey: ['userRating', movieId],
    queryFn: async (): Promise<UserRating | null> => {
      const response = await axiosInstance.get(getUserMovieRatingUrl(movieId));
      return response.data;
    },
    enabled: !!movieId,
    retry: false,
  });
};
