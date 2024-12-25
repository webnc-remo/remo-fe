import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../index';

interface PlaylistDetailParams {
  page?: number;
  take?: number;
}

export const usePlaylistDetail = (
  playlistId: string,
  params: PlaylistDetailParams = {}
) => {
  return useQuery({
    queryKey: ['playlist-detail', playlistId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/playlists/${playlistId}/movies`,
        {
          params: {
            page: params.page || 1,
            take: params.take || 10,
          },
        }
      );
      return response.data;
    },
    enabled: !!playlistId,
  });
};
