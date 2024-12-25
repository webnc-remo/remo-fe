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
          background: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'white',
          color: 'white',
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
      <Badge count={playlistCount} size="small">
        <Button
          type="default"
          disabled={
            !Array.isArray(moviePlaylists) || moviePlaylists.length === 0
          }
          icon={<PlaySquareOutlined />}
          size="large"
          style={{
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              Array.isArray(moviePlaylists) && moviePlaylists.length > 0
                ? 'rgba(147, 51, 234, 0.2)'
                : 'rgba(255, 255, 255, 0.2)',
            borderColor:
              Array.isArray(moviePlaylists) && moviePlaylists.length > 0
                ? '#9333ea'
                : 'white',
            color:
              Array.isArray(moviePlaylists) && moviePlaylists.length > 0
                ? '#9333ea'
                : 'white',
          }}
          onClick={onOpenModal}
        />
      </Badge>
    </Popover>
  );
};
