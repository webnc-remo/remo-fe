import { useMutation } from '@tanstack/react-query';
import { axiosInstance, removeMovieFromPlaylistUrl } from '..';

interface RemoveFromPlaylistParams {
  playlistId: string;
  movieId: string;
}

export const useRemoveFromPlaylist = () => {
  const mutation = useMutation({
    mutationFn: async ({ playlistId, movieId }: RemoveFromPlaylistParams) => {
      const response = await axiosInstance.delete(
        removeMovieFromPlaylistUrl(playlistId, movieId)
      );
      return response.data;
    },
  });

  return {
    removeFromPlaylist: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
