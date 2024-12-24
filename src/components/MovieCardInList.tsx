import React from 'react';
import { Card, Button, Popconfirm, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { getMovieDetailImageUrl, noImageUrl } from '../apis';
import { Movie } from '../interface/movie.interface';
import { useAuthStore } from '../stores/authStore';

interface MovieCardInListProps {
  movie: Movie;
  onRemove?: (tmdbId: number) => void;
  loading?: boolean;
  showRemoveButton?: boolean;
  removeButtonText?: string;
  removeConfirmTitle?: string;
  removeConfirmDescription?: string;
  showFavoriteButton?: boolean;
}

const MovieCardInList: React.FC<MovieCardInListProps> = ({
  movie,
  onRemove,
  loading = false,
  showRemoveButton = true,
  removeButtonText = "Remove",
  removeConfirmTitle = "Remove from list",
  removeConfirmDescription = "Are you sure you want to remove this movie?",
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const shouldShowRemoveButton = isAuthenticated && showRemoveButton && onRemove;

  return (
    <Card
      hoverable
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col sm:flex-row">
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
            {shouldShowRemoveButton && (
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

          {/* Basic Movie Info */}
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.vote_average > 0 && (
              <Tag color="blue">
                Rating: {Math.round(movie.vote_average * 10)}%
              </Tag>
            )}
            {movie.adult && (
              <Tag color="red">Adult</Tag>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MovieCardInList;
