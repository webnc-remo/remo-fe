import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getMovieRatingReviewUrl } from '..';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatar: string | null;
}

interface MovieRatingReview {
  id: string;
  user: User;
  rating: number;
  review: string;
  createdAt: string;
}

export const useGetMovieRatingReviews = (movieId: string) => {
  return useQuery<MovieRatingReview[]>({
    queryKey: ['movie-reviews', movieId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        getMovieRatingReviewUrl(movieId)
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};
