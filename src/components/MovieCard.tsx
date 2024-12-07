import React from 'react';
import { Card, Typography, Space } from 'antd';
import { Movie } from '../interface/movie.interface';

const { Title, Text } = Typography;

export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://media.themoviedb.org/t/p/w220_and_h330_face/${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Card
      hoverable
      cover={
        <img
          alt={movie.title}
          src={imageUrl}
          style={{
            width: '100%',
            height: '330px',
            objectFit: 'cover',
            borderRadius: '10px 10px 0 0',
          }}
        />
      }
      style={{
        width: '75%',
        maxWidth: '360px',
        marginBottom: '10px',
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
            style={{
              fontSize: '18px',
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
            <Text>
              {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>

            <Space size="small">
              <Text>
                Rating: {movie.vote_average.toFixed(1)}
              </Text>
            </Space>
          </Space>
        }
      />
    </Card>
  );
};
