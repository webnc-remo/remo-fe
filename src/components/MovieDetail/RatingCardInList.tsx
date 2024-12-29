import React from 'react';
import { Card, Button, Popconfirm, Tag, Progress } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { getMovieDetailImageUrl, noImageUrl } from '../../apis';
import { Movie } from '../../interface/movie.interface';
import dayjs from 'dayjs';

interface RatingCardInListProps {
    movie: Movie;
    rating: {
        rating: number;
        review: string;
        createdAt: string;
        id: string;
    };
    onRemove?: (tmdbId: number) => void;
    loading?: boolean;
}

const RatingCardInList: React.FC<RatingCardInListProps> = ({
    movie,
    rating,
    onRemove,
    loading = false,
}) => {
    if (!movie) {
        return null;
    }

    const getRatingColor = (rating: number) => {
        if (rating >= 80) return '#52c41a';
        if (rating >= 60) return '#1890ff';
        if (rating >= 40) return '#faad14';
        return '#f5222d';
    };

    const formatRating = (percent: number | undefined) => {
        if (typeof percent !== 'number') return '';
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    lineHeight: 1,
                }}
            >
                <span
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: getRatingColor(rating.rating),
                    }}
                >
                    {rating.rating}
                </span>
                <span
                    style={{
                        fontSize: '10px',
                        color: '#666',
                    }}
                >
                    /100
                </span>
            </div>
        );
    };

    return (
        <Card hoverable bodyStyle={{ padding: 0 }}>
            <div className="flex flex-col sm:flex-row">
                {/* Poster Section */}
                <div className="w-full sm:w-40 flex-shrink-0">
                    <Link to={`/movie/${movie.tmdb_id}`}>
                        <img
                            alt={movie.title}
                            src={
                                movie.poster_path
                                    ? getMovieDetailImageUrl(movie.poster_path)
                                    : noImageUrl
                            }
                            className="w-full h-[180px] sm:h-[240px] object-cover"
                            style={{
                                objectFit: 'cover',
                                borderTopLeftRadius: '8px',
                                borderBottomLeftRadius: '8px',
                            }}
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
                                title="Remove Rating"
                                description="Are you sure you want to remove this rating?"
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
                                    Remove Rating
                                </Button>
                            </Popconfirm>
                        )}
                    </div>

                    {/* Rating Section with updated styling */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <Progress
                                type="circle"
                                percent={rating.rating}
                                size={70}
                                strokeColor={getRatingColor(rating.rating)}
                                format={formatRating}
                                strokeWidth={8}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600">Your Rating</span>
                                <span className="text-sm text-gray-500">
                                    {dayjs(rating.createdAt).format('MMMM D, YYYY')}
                                </span>
                            </div>
                        </div>

                        {/* Review Section with updated styling */}
                        {rating.review && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <h3 className="font-semibold mb-2 text-gray-700">Your Review</h3>
                                <div
                                    className="bg-white p-3 rounded-md border border-gray-200 shadow-sm"
                                    style={{
                                        position: 'relative',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: -8,
                                            top: 10,
                                            width: 3,
                                            height: 'calc(100% - 20px)',
                                            backgroundColor: getRatingColor(rating.rating),
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <p className="text-gray-600 line-clamp-3">{rating.review}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Movie Overview with updated styling */}
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2 text-gray-700">Overview</h3>
                        <p className="text-gray-600 line-clamp-3">
                            {movie.overview || 'No overview available.'}
                        </p>
                    </div>

                    {/* Tags with updated styling */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {movie.genres?.map((genre) => (
                            <Tag
                                key={genre.id}
                                style={{
                                    borderRadius: '12px',
                                    padding: '2px 12px'
                                }}
                            >
                                {genre.name}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default RatingCardInList;
