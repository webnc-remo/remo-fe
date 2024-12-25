import { Button, Popover, Badge } from 'antd';
import { PlaySquareOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePlaylistsByMovie } from '../../../apis/lists/usePlaylistsByMovie';
import { PlaylistContent } from './PlaylistContent';

interface PlaylistButtonProps {
  movieId: string;
  isAuthenticated: boolean;
  onOpenModal: () => void;
}

export const PlaylistButton = ({
  movieId,
  isAuthenticated,
  onOpenModal,
}: PlaylistButtonProps) => {
  const navigate = useNavigate();
  const { data: moviePlaylists } = usePlaylistsByMovie(movieId, {
    enabled: isAuthenticated,
  });

  const playlistCount = moviePlaylists?.length ?? 0;
  const hasPlaylists =
    Array.isArray(moviePlaylists) && moviePlaylists.length > 0;

  const colors = {
    active: {
      badge: '#1890ff',
      badgeText: '#ffffff',
      background: '#e6f7ff',
      border: '#69c0ff',
      text: '#1890ff',
    },
    inactive: {
      badge: '#f0f0f0',
      badgeText: '#595959',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'white',
      text: 'white',
    },
  };

  const handleUnauthorizedClick = () => {
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <Button
        type="default"
        icon={<PlaySquareOutlined />}
        size="large"
        style={{
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.inactive.background,
          borderColor: colors.inactive.border,
          color: colors.inactive.text,
        }}
        onClick={handleUnauthorizedClick}
      />
    );
  }

  return (
    <Popover
      content={<PlaylistContent movieId={movieId} />}
      title="Movie added to playlists:"
      trigger={['hover', 'click']}
      placement="right"
      arrow={true}
    >
      <Badge
        count={playlistCount}
        size="default"
        style={{
          backgroundColor: hasPlaylists
            ? colors.active.badge
            : colors.inactive.badge,
          color: hasPlaylists
            ? colors.active.badgeText
            : colors.inactive.badgeText,
          fontSize: '12px',
          fontWeight: '700',
        }}
      >
        <Button
          type="default"
          icon={<PlaySquareOutlined />}
          size="large"
          style={{
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: hasPlaylists
              ? colors.active.background
              : colors.inactive.background,
            borderColor: hasPlaylists
              ? colors.active.border
              : colors.inactive.border,
            color: hasPlaylists ? colors.active.text : colors.inactive.text,
            transition: 'all 0.3s ease',
          }}
          onClick={onOpenModal}
        />
      </Badge>
    </Popover>
  );
};
