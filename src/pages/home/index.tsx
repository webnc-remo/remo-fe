import React, { useState } from 'react';
import { Switch, Typography, Row, Col, Spin } from 'antd';
import { MovieCard } from '../../components/MovieCard';
import { useGetTrendingMovie } from '../../apis/movie/useGetTrendingMovie';
import './Home.css';

const { Title } = Typography;

export const Home: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const { movies, loading } = useGetTrendingMovie(timeWindow);

  const handleToggle = (checked: boolean) => {
    setTimeWindow(checked ? 'week' : 'day');
  };

  return (
    <div className="home-container">
      <div className="flex items-center space-x-4">
        <Title level={2} className="trending-title" style={{ marginBottom: 0 }}>
          Trending
        </Title>
        <Switch
          checked={timeWindow === 'week'}
          onChange={handleToggle}
          checkedChildren="This Week"
          unCheckedChildren="Today"
          className="toggle-switch"
        />
      </div>

      {loading && <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />}

      <div style={{ marginBottom: '20px' }}></div>
      <Row gutter={[3, 3]} style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {movies.map((movie) => (
          <Col
            xs={12} sm={8} md={6} lg={4} xl={3}
            key={movie.id}
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </div >
  );
};
