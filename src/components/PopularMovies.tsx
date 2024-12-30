import React from 'react';
import { Typography, Row, Col, Spin } from 'antd';
import { MovieCard } from './MovieCard';
import { useGetPopularMovies } from '../apis/movie/useGetPopularMovies';

const { Title } = Typography;

export const PopularMovies: React.FC = () => {
  const { movies, loading } = useGetPopularMovies();

  return (
    <>
      <div
        className="flex items-center space-x-4"
        style={{ position: 'relative' }}
      >
        <Title level={2} className="popular-title" style={{ marginBottom: 0 }}>
          What's Popular
        </Title>
        {loading && (
          <Spin
            size="large"
            style={{
              display: 'block',
              margin: '0 auto',
              position: 'absolute',
              right: '50%',
            }}
          />
        )}
      </div>

      <div style={{ marginBottom: '20px' }}></div>
      <Row
        gutter={[16, 16]}
        style={{
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          margin: '0 auto',
        }}
      >
        {movies.map((movie) => (
          <Col xs={12} sm={8} md={6} lg={8} xl={4} key={movie.id}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </>
  );
};
