import { useQuery } from '@tanstack/react-query';
import { axiosInstance, checkMovieInPlaylistsUrl } from '../index';
interface Playlist {
  id: string;
  listName: string;
  description?: string;
  createdAt: string;
}

export const usePlaylistsByMovie = (
  movieId?: string,
  options: { enabled: boolean } = { enabled: true }
) => {
  return useQuery({
    queryKey: ['playlists', 'movie', movieId],
    queryFn: async (): Promise<Playlist[]> => {
      if (!movieId) throw new Error('Movie ID is required');
      const response = await axiosInstance.get(
        checkMovieInPlaylistsUrl(movieId)
      );
      return response.data.playlists;
    },
    enabled: options.enabled,
  });
};
