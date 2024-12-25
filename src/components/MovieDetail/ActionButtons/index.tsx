import { Space } from 'antd';
import { PlaylistButton } from './PlaylistButton';
import { FavoriteButton } from './FavoriteButton';
import { WatchlistButton } from './WatchlistButton';

interface ActionButtonsProps {
  movieId: string;
  isAuthenticated: boolean;
  onOpenPlaylistModal: () => void;
}

export const ActionButtons = ({
  movieId,
  isAuthenticated,
  onOpenPlaylistModal,
}: ActionButtonsProps) => {
  return (
    <Space size="middle">
      <PlaylistButton
        movieId={movieId}
        isAuthenticated={isAuthenticated}
        onOpenModal={onOpenPlaylistModal}
      />
      <FavoriteButton movieId={movieId} isAuthenticated={isAuthenticated} />
      <WatchlistButton movieId={movieId} isAuthenticated={isAuthenticated} />
    </Space>
  );
};
