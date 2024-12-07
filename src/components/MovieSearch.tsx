import React from 'react';
import { Row, Col, Spin, Typography } from 'antd';
import { MovieCard } from './MovieCard';
import { useSearchMovie } from '../apis/movie/useSearchMovie';

const { Title } = Typography;

export const MovieSearch: React.FC<{ initialQuery?: string }> = ({
  initialQuery,
}) => {
  const { movies, loading } = useSearchMovie(initialQuery ?? '');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Movie Search Results for "{initialQuery}"
      </Title>

      {loading && (
        <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
      )}
      {movies.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Title level={4}>
            No movies found. Please try a different search.
          </Title>
        </div>
      )}

      <Row gutter={[16, 16]} style={{ justifyContent: 'center' }}>
        {movies.map((movie) => (
          <Col xs={12} sm={8} md={6} lg={6} xl={6} key={movie.id}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
