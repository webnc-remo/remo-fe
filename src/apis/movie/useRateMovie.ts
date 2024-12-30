import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance, rateMovieUrl, updateRatingUrl } from '..';
import { message } from 'antd';

interface RateMovieParams {
  movieId: string;
  rating: number;
  review?: string;
  isUpdate?: boolean;
}

export const useRateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      movieId,
      rating,
      review,
      isUpdate,
    }: RateMovieParams) => {
      const payload: { rating: number; review?: string } = {
        rating,
      };

      if (review?.trim()) {
        payload.review = review.trim();
      }

      // Sử dụng URL khác nhau cho create và update
      const url = isUpdate ? updateRatingUrl(movieId) : rateMovieUrl(movieId);
      const method = isUpdate ? 'put' : 'post';

      const response = await axiosInstance[method](url, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      message.success(
        variables.isUpdate
          ? 'Rating updated successfully!'
          : 'Rating submitted successfully!'
      );
      // Invalidate cả rating của user và movie detail
      queryClient.invalidateQueries({ queryKey: ['userRating'] });
      queryClient.invalidateQueries({ queryKey: ['movieDetail'] });
    },
    onError: (error) => {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).message || 'Failed to submit rating';
      message.error(errorMessage);
    },
  });
};
