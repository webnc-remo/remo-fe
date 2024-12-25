import { Button, message } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useToggleWatchlist } from '../../../apis/user/useToggleWatchlist';
import { useCheckUserWatchlist } from '../../../apis/user/useCheckUserWatchlist';

interface WatchlistButtonProps {
  movieId: string;
  isAuthenticated: boolean;
}

export const WatchlistButton = ({
  movieId,
  isAuthenticated,
}: WatchlistButtonProps) => {
  const navigate = useNavigate();
  const { toggleWatchlist, loading: watchlistLoading } = useToggleWatchlist();
  const {
    isWatchlist,
    loading: checkWatchlistLoading,
    refetch: refetchWatchlist,
  } = useCheckUserWatchlist(movieId, {
    enabled: isAuthenticated,
  });

  const handleUnauthorizedClick = () => {
    navigate('/login');
    message.info('Please login to use this feature');
  };

  const handleWatchlistClick = () => {
    if (!isAuthenticated) {
      handleUnauthorizedClick();
      return;
    }

    toggleWatchlist(
      {
        movieId,
        action: isWatchlist ? 'remove' : 'add',
      },
      {
        onSuccess: () => {
          refetchWatchlist();
          message.success(
            isWatchlist ? 'Removed from watchlist' : 'Added to watchlist'
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          message.error(
            error?.response?.data?.message ||
              'Failed to update watchlist status'
          );
        },
      }
    );
  };

  return (
    <Button
      type="default"
      icon={<BookOutlined />}
      size="large"
      style={{
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          isAuthenticated && isWatchlist
            ? 'rgba(0, 128, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.2)',
        borderColor: isAuthenticated && isWatchlist ? '#52c41a' : 'white',
        color: isAuthenticated && isWatchlist ? '#52c41a' : 'white',
      }}
      title={
        !isAuthenticated
          ? 'Please login to add to watchlist'
          : isWatchlist
            ? 'Remove from watchlist'
            : 'Add to watchlist'
      }
      onClick={handleWatchlistClick}
      loading={isAuthenticated && (watchlistLoading || checkWatchlistLoading)}
    />
  );
};
