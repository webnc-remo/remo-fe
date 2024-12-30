import React, { useState } from 'react';
import { Switch, Typography, Row, Col, Spin } from 'antd';
import { MovieCard } from './MovieCard';
import { useGetTrendingMovie } from '../apis/movie/useGetTrendingMovie';

const { Title } = Typography;

export const TrendingMovies: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const { movies, loading } = useGetTrendingMovie(timeWindow);

  const handleToggle = (checked: boolean) => {
    setTimeWindow(checked ? 'week' : 'day');
  };

  return (
    <>
      <div
        className="flex items-center space-x-4"
        style={{ position: 'relative' }}
      >
        <Title level={2} className="trending-title" style={{ marginBottom: 0 }}>
          Trending
        </Title>
        <Switch
          checked={timeWindow === 'week'}
          onChange={handleToggle}
          checkedChildren="This Week"
          unCheckedChildren="Today"
        />
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