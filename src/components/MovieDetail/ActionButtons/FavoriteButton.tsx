import { Button, message } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToggleFavorite } from '../../../apis/user/useToggleFavorite';
import { useCheckUserFavMovie } from '../../../apis/user/useCheckUserFavMovie';

interface FavoriteButtonProps {
  movieId: string;
  isAuthenticated: boolean;
}

export const FavoriteButton = ({
  movieId,
  isAuthenticated,
}: FavoriteButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();
  const {
    isFavorite,
    loading: checkLoading,
    refetch,
  } = useCheckUserFavMovie(movieId, {
    enabled: isAuthenticated,
  });

  const handleUnauthorizedClick = () => {
    navigate('/login', { state: { from: location.pathname } });
    message.info('Please login to use this feature');
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      handleUnauthorizedClick();
      return;
    }

    toggleFavorite(
      {
        movieId,
        action: isFavorite ? 'remove' : 'add',
      },
      {
        onSuccess: () => {
          refetch();
          message.success(
            isFavorite ? 'Removed from favorites' : 'Added to favorites'
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          message.error(
            error?.response?.data?.message || 'Failed to update favorite status'
          );
        },
      }
    );
  };

  return (
    <Button
      type="default"
      icon={<HeartOutlined />}
      size="large"
      style={{
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          isAuthenticated && isFavorite
            ? 'rgba(255, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.2)',
        borderColor: isAuthenticated && isFavorite ? '#ff4d4f' : 'white',
        color: isAuthenticated && isFavorite ? '#ff4d4f' : 'white',
      }}
      title={
        !isAuthenticated
          ? 'Please login to add to favorites'
          : isFavorite
            ? 'Remove from favorites'
            : 'Add to favorites'
      }
      onClick={handleFavoriteClick}
      loading={isAuthenticated && (favoriteLoading || checkLoading)}
    />
  );
};
