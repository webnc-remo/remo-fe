import React from 'react';
import { Typography, Spin, Row, Col } from 'antd';
import { VideoCard } from './VideoCard';
import { useGetMovieTrailers } from '../apis/movie/useGetMovieTrailers';

const { Title } = Typography;

export const MovieTrailers: React.FC = () => {
  const { movies, loading } = useGetMovieTrailers();

  return (
    <>
      <div
        className="flex items-center space-x-4"
        style={{ position: 'relative' }}
      >
        <Title level={2} style={{ marginBottom: 0 }}>
          Latest Trailers
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
        gutter={[8, 8]}
        style={{
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          margin: '0 auto',
        }}
      >
        {movies.map((movie) => (
          <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <VideoCard movie={movie} />
          </Col>
        ))}
      </Row>
    </>
  );
};
