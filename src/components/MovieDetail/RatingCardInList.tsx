import React from 'react';
import { Card, Button, Popconfirm, Tag, Progress } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { getMovieDetailImageUrl, noImageUrl } from '../../apis';
import { Movie } from '../../interface/movie.interface';
import dayjs from 'dayjs';

interface RatingCardInListProps {
    movie: Movie;
    rating: number;
    review?: string;
    createdAt: string;
    onRemove?: (tmdbId: number) => void;
    loading?: boolean;
}

const RatingCardInList: React.FC<RatingCardInListProps> = ({
    movie,
    rating,
    review,
    createdAt,
    onRemove,
    loading = false,
}) => {
    const getRatingColor = (rating: number) => {
        if (rating >= 80) return '#52c41a';
        if (rating >= 60) return '#1890ff';
        if (rating >= 40) return '#faad14';
        return '#f5222d';
    };

    const formatRating = (percent: number | undefined) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            lineHeight: 1
        }}>
            <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: getRatingColor(percent || 0)
            }}>
                {percent}
            </span>
            <span style={{
                fontSize: '10px',
                color: '#666'
            }}>
                /100
            </span>
        </div>
    );

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
                                borderBottomLeftRadius: '8px'
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

                    {/* Rating Section */}
                    <div className="mt-2 flex items-center gap-4">
                        <Progress
                            type="circle"
                            percent={rating}
                            size={70}
                            strokeColor={getRatingColor(rating)}
                            format={formatRating}
                            strokeWidth={8}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Your Rating</span>
                            <span className="text-gray-500 text-sm">
                                {dayjs(createdAt).format('MMMM D, YYYY')}
                            </span>
                        </div>
                    </div>

                    {/* Review Section */}
                    {review && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Your Review</h3>
                            <p className="text-gray-600 line-clamp-3">{review}</p>
                        </div>
                    )}

                    {/* Movie Overview */}
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Overview</h3>
                        <p className="text-gray-600 line-clamp-3">
                            {movie.overview || 'No overview available.'}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {movie.genres?.map((genre) => (
                            <Tag key={genre.id}>{genre.name}</Tag>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default RatingCardInList; 
