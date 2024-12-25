import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Empty, Pagination, message, Button } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShareAltOutlined } from '@ant-design/icons';
import { useGetUserFavMovie } from '../../apis/user/useGetUserFavMovie';
import { useToggleFavorite } from '../../apis/user/useToggleFavorite';
import MovieCardInList from '../../components/MovieCardInList';

const FavoriteMovies: React.FC = () => {
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

  const { movies, loading, meta, listInfo, refetch } = useGetUserFavMovie({
    page: currentPage,
    take: pageSize,
  });

  const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    navigate(`/favorites?${params.toString()}`, { replace: true });
  }, [currentPage, pageSize, navigate]);

  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleRemoveFromFavorites = async (tmdbId: number) => {
    try {
      toggleFavorite(
        {
          movieId: tmdbId.toString(),
          action: 'remove',
        },
        {
          onSuccess: () => {
            message.success('Movie removed from favorites');
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
                'Failed to remove from favorites'
            );
          },
        }
      );
    } catch (error) {
      message.error(
        (error as Error).message || 'Failed to remove from favorites'
      );
    }
  };

  const handleShare = () => {
    if (listInfo?.id) {
      const shareUrl = `${window.location.origin}/share/list/${listInfo.id}`;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          message.success('Share link copied to clipboard!');
        })
        .catch(() => {
          message.error('Failed to copy share link');
        });
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
    return <Empty description="No favorite movies yet" className="mt-8" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Favorite Movies</h1>
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          className="flex items-center"
        >
          Share List
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col xs={24} md={12} key={movie.id}>
            <MovieCardInList
              movie={movie}
              onRemove={handleRemoveFromFavorites}
              loading={favoriteLoading}
              removeButtonText="Remove"
              removeConfirmTitle="Remove from favorites"
              removeConfirmDescription="Are you sure you want to remove this movie from your favorites?"
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
          />
        </div>
      )}
    </div>
  );
};

export default FavoriteMovies;
