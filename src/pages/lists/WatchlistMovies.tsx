import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Empty, Pagination, message, Button } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShareAltOutlined } from '@ant-design/icons';
import { useGetUserWatchlist } from '../../apis/user/useGetUserWatchlist';
import MovieCardInList from '../../components/MovieCardInList';
import { useToggleWatchlist } from '../../apis/user/useToggleWatchlist';
import { Movie } from '../../interface/movie.interface';

const WatchlistMovies: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const size = searchParams.get('size');
    return size ? parseInt(size) : 10;
  });

  const { movies, loading, meta, listInfo, refetch } = useGetUserWatchlist({
    page: currentPage,
    take: pageSize,
  });

  const { toggleWatchlist, loading: watchlistLoading } = useToggleWatchlist();

  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    navigate(`/watchlist?${params.toString()}`, { replace: true });
  }, [currentPage, pageSize, navigate]);

  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleRemoveFromWatchlist = async (tmdbId: number) => {
    try {
      toggleWatchlist(
        {
          movieId: tmdbId.toString(),
          action: 'remove',
        },
        {
          onSuccess: () => {
            message.success('Movie removed from watchlist');
            if (movies.length === 1 && currentPage > 1) {
              setCurrentPage((prev) => prev - 1);
            } else {
              refetch();
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            message.error(
              error?.response?.data?.message ||
              'Failed to remove from watchlist'
            );
          },
        }
      );
    } catch (error) {
      message.error(
        (error as Error).message || 'Failed to remove from watchlist'
      );
    }
  };

  const handleShare = async () => {
    if (listInfo?.id) {
      setShareLoading(true);
      try {
        const shareUrl = `${window.location.origin}/share/list/${listInfo.id}`;
        await navigator.clipboard.writeText(shareUrl);
        message.success('Share link copied to clipboard!');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error('Failed to copy share link');
      } finally {
        setShareLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!movies?.length) {
    return <Empty description="No movies in watchlist yet" className="mt-8" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          loading={shareLoading}
          className="flex items-center"
        >
          {shareLoading ? 'Copying...' : 'Share List'}
        </Button>
      </div>

      <div className="relative">
        {watchlistLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}

        <Row gutter={[16, 16]}>
          {movies.map((movie: Movie) => (
            <Col xs={24} md={12} key={movie.id}>
              <MovieCardInList
                movie={movie}
                onRemove={handleRemoveFromWatchlist}
                loading={watchlistLoading}
                removeButtonText="Remove"
                removeConfirmTitle="Remove from watchlist"
                removeConfirmDescription="Are you sure you want to remove this movie from your watchlist?"
              />
            </Col>
          ))}
        </Row>

        {meta && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={meta.itemCount}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total) => `Total ${total} movies`}
              pageSizeOptions={['10', '20', '30', '40']}
              disabled={watchlistLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistMovies;
