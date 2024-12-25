import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getUserPlaylistsUrl } from '../index';
import { Movie } from '../../interface/movie.interface';

interface Playlist {
  id: string;
  listName: string;
  description?: string;
  imageUrl?: string;
  items?: Movie[];
}

export const useUserPlaylists = () => {
  return useQuery({
    queryKey: ['user-playlists'],
    queryFn: async () => {
      const response = await axiosInstance.get<Playlist[]>(
        getUserPlaylistsUrl()
      );
      return response.data;
    },
  });
};
