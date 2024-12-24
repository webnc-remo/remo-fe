import React from 'react';
import { Card, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { getMovieDetailImageUrl, noImageUrl } from '../apis';
import { Movie } from '../interface/movie.interface';

interface MovieCardInListProps {
    movie: Movie;
    onRemove?: (tmdbId: number) => void;
    loading?: boolean;
    removeButtonText?: string;
    removeConfirmTitle?: string;
    removeConfirmDescription?: string;
}

const MovieCardInList: React.FC<MovieCardInListProps> = ({
    movie,
    onRemove,
    loading = false,
    removeButtonText = "Remove",
    removeConfirmTitle = "Remove from list",
    removeConfirmDescription = "Are you sure you want to remove this movie?"
}) => {
    return (
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
                            src={
                                movie.poster_path
                                    ? getMovieDetailImageUrl(movie.poster_path)
                                    : noImageUrl
                            }
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
                                {movie.release_date
                                    ? new Date(movie.release_date).getFullYear()
                                    : 'N/A'}
                            </p>
                        </div>
                        {onRemove && (
                            <Popconfirm
                                title={removeConfirmTitle}
                                description={removeConfirmDescription}
                                onConfirm={() => onRemove(movie.tmdb_id)}
                                okText="Yes"
                                cancelText="No"
                                disabled={loading}
                            >
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger
                                    loading={loading}
                                >
                                    {removeButtonText}
                                </Button>
                            </Popconfirm>
                        )}
                    </div>

                    {/* Movie Overview */}
                    <div className="mt-2 flex-grow">
                        <h3 className="font-semibold mb-2">Overview</h3>
                        <p className="text-gray-600 line-clamp-3">
                            {movie.overview || 'No overview available.'}
                        </p>
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
    );
};

export default MovieCardInList;
