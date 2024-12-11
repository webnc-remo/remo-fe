import React from 'react';
import { Row, Col, Spin, Typography, Pagination } from 'antd';
import { MovieCard } from './MovieCard';
import { useSearchMovie } from '../apis/movie/useSearchMovie';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

export const MovieSearch: React.FC<{ initialQuery?: string, initialPage?: number }> = ({
  initialQuery,
  initialPage,
}) => {
  const { movies, loading, totalPages, currentPage, setCurrentPage } = useSearchMovie(initialQuery ?? '', initialPage ?? 1);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    navigate(`/search?query=${encodeURIComponent(initialQuery ?? '')}&page=${page}`);
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
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

      <Row
        gutter={[16, 16]}
        style={{ flexWrap: 'wrap', justifyContent: 'flex-start', margin: '0 auto' }}
      >
        {movies.map((movie) => (
          <Col
            xs={12}
            sm={8}
            md={6}
            lg={8}
            xl={4}
            key={movie.id}
          >
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
      {!loading && (
        <Pagination
          current={currentPage}
          total={totalPages * 20}
          onChange={handlePageChange}
          defaultPageSize={20}
          defaultCurrent={initialPage}
          style={{ marginTop: '20px', textAlign: 'center', display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', 
          }}
        />
      )}
    </div>
  );
};
