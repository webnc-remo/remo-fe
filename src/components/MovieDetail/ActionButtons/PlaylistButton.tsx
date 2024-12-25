import { Button, Popover, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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

  const handleUnauthorizedClick = () => {
    navigate('/login');
    message.info('Please login to use this feature');
  };

  if (!isAuthenticated) {
    return (
      <Button
        type="default"
        icon={<PlusOutlined />}
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
      <Button
        type="default"
        icon={<PlusOutlined />}
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
    </Popover>
  );
};
