import React from 'react';
import { Card, Typography, Progress } from 'antd';
import { Movie } from '../interface/movie.interface';
import { Link } from 'react-router-dom';
import { getMovieCardImageUrl, noImageUrl } from '../apis';

const { Title, Text } = Typography;

export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? getMovieCardImageUrl(movie.poster_path)
    : noImageUrl;

  return (
    <Link to={`/movie/${movie.tmdb_id}`}>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img alt={movie.title} src={imageUrl} />
            <Progress
              size={35}
              style={{
                fontWeight: 'bold',
                backgroundColor: '#1B4D4F',
                borderRadius: '50%',
                padding: '2px',
                position: 'absolute',
                bottom: '-15px',
                left: '8px',
              }}
              strokeWidth={8}
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              type="circle"
              percent={
                movie?.vote_average ? Math.floor(movie?.vote_average * 10) : 0
              }
            />
          </div>
        }
        style={{
          maxWidth: '360px',
          marginBottom: '10px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.5s ease-in-out',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Card.Meta
          title={
            <Title
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '250px',
                padding: '0',
                margin: '5px 0 0 0',
              }}
              title={movie.title}
            >
              {movie.title}
            </Title>
          }
          description={
            <Text>
              {new Date(movie.release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          }
        />
      </Card>
    </Link>
  );
};
