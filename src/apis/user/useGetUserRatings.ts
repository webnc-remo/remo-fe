import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getUserRatingsUrl } from '..';
import { Movie } from '../../interface/movie.interface';

interface RatingItem {
  movie: {
    item: Movie;
  };
  rating: {
    id: string;
    rating: number;
    review: string;
    tmdb_id: string;
    createdAt: string;
  };
}

interface RatingsResponse {
  items: RatingItem[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const useGetUserRatings = (page: number, take: number) => {
  return useQuery<RatingsResponse>({
    queryKey: ['user-ratings', page, take],
    queryFn: async () => {
      const response = await axiosInstance.get(
        getUserRatingsUrl({ page, take })
      );
      return response.data;
    },
  });
};
