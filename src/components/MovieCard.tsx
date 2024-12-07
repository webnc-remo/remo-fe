import React from 'react';
import { Card, Typography, Rate, Space } from 'antd';
import { Movie } from '../interface/movie.interface';

const { Title, Text } = Typography;

export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const rating = movie.vote_average / 2;

  return (
    <Card
      hoverable
      cover={
        <img
          alt={movie.title}
          src={imageUrl}
          style={{
            width: '100%',
            height: '450px',
            objectFit: 'cover',
            borderRadius: '10px 10px 0 0',
          }}
        />
      }
      style={{
        width: '100%',
        maxWidth: '360px',
        marginBottom: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Card.Meta
        title={
          <Title
            level={4}
            style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '250px',
            }}
          >
            {movie.title}
          </Title>
        }
        description={
          <Space direction="vertical" size={4}>
            {/* Release Year */}
            <Text type="secondary">
              Release Year: {new Date(movie.release_date).getFullYear()}
            </Text>

            {/* Rating with half-star precision */}
            <Space>
              <Rate disabled defaultValue={rating} allowHalf />
              <Text>{movie.vote_average}</Text>
            </Space>
          </Space>
        }
      />
    </Card>
  );
};
