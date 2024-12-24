import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Empty, Pagination, Button, Popconfirm, message } from 'antd';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getMovieDetailImageUrl, noImageUrl } from '../../apis';
import { useGetUserFavMovie } from '../../apis/user/useGetUserFavMovie';
import { DeleteOutlined } from '@ant-design/icons';
import { useToggleFavorite } from '../../apis/user/useToggleFavorite';

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

    const { movies, loading, meta, refetch } = useGetUserFavMovie({
        page: currentPage,
        take: pageSize,
    });

    const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();

    // Update URL when page or size changes
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('size', pageSize.toString());
        navigate(`/favorites?${params.toString()}`, { replace: true });
    }, [currentPage, pageSize, navigate]);

    const handlePageChange = (page: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            setCurrentPage(1); // Reset to first page when changing page size
        } else {
            setCurrentPage(page);
        }
    };

    const handleRemoveFromFavorites = async (tmdbId: number) => {
        try {
            toggleFavorite(tmdbId.toString(), {
                onSuccess: () => {
                    message.success('Movie removed from favorites');
                    refetch(); // Refetch the data after successful removal
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    message.error(error?.response?.data?.message || 'Failed to remove from favorites');
                }
            });
        } catch (error) {
            message.error((error as Error).message || 'Failed to remove from favorites');
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
        return (
            <Empty
                description="No favorite movies yet"
                className="mt-8"
            />
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Favorite Movies</h1>
            <Row gutter={[16, 16]}>
                {movies.map((movie) => (
                    <Col xs={24} md={12} key={movie.id}>
                        <Card
                            hoverable
                            className="overflow-hidden h-full"
                            bodyStyle={{ padding: 0 }}
                        >
                            <div className="flex flex-col sm:flex-row h-full">
                                {/* Poster Section */}
                                <div className="w-full sm:w-48 flex-shrink-0">
                                    <Link to={`/movie/${movie.tmdb_id}`}>
                                        <img
                                            alt={movie.title}
                                            src={movie.poster_path ? getMovieDetailImageUrl(movie.poster_path) : noImageUrl}
                                            className="w-full h-[200px] sm:h-full object-cover"
                                        />
                                    </Link>
                                </div>

                                {/* Content Section */}
                                <div className="flex-grow p-4 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link to={`/movie/${movie.tmdb_id}`}>
                                                <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                                            </Link>
                                            <p className="text-gray-500">
                                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                            </p>
                                        </div>
                                        <Popconfirm
                                            title="Remove from favorites"
                                            description="Are you sure you want to remove this movie from favorites?"
                                            onConfirm={() => handleRemoveFromFavorites(movie.tmdb_id)}
                                            okText="Yes"
                                            cancelText="No"
                                            disabled={favoriteLoading}
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                danger
                                                loading={favoriteLoading}
                                            >
                                                Remove
                                            </Button>
                                        </Popconfirm>
                                    </div>

                                    {/* Movie Overview */}
                                    <div className="mt-2 flex-grow">
                                        <h3 className="font-semibold mb-2">Overview</h3>
                                        <p className="text-gray-600 line-clamp-3">{movie.overview || 'No overview available.'}</p>
                                    </div>

                                    {/* Additional Movie Info */}
                                    <div className="mt-4 flex items-center space-x-4">
                                        {movie.vote_average > 0 && (
                                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Rating: {Math.round(movie.vote_average * 10)}%
                                            </span>
                                        )}
                                        {movie.adult && (
                                            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                                                Adult
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
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
