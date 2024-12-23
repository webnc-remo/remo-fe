import React, { useState } from 'react';
import { Row, Col, Spin, Typography, Pagination } from 'antd';
import { MovieCard } from './MovieCard';
import { useSearchMovie } from '../apis/movie/useSearchMovie';
import { useNavigate } from 'react-router-dom';
import { SearchParam } from '../apis';

const { Title } = Typography;

export const MovieSearch: React.FC<{
  initialQuery?: string;
  initialPage?: number;
  initialPageSize?: number;
  initialOrder?: 'asc' | 'desc';
}> = ({
  initialQuery = '',
  initialPage = 1,
  initialPageSize = 12,
  initialOrder = 'asc',
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const navigate = useNavigate();

  const query: SearchParam = {
    page: currentPage,
    take: pageSize,
    q: initialQuery,
    order: initialOrder,
  };

  const { movies, loading, meta } = useSearchMovie(query);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }

    navigate(
      `/search?query=${encodeURIComponent(initialQuery)}&page=${page}&take=${newPageSize ?? pageSize}`,
      { replace: true }
    );
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Movie Search Results for "{initialQuery}"
      </Title>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Title level={4}>
            No movies found. Please try a different search.
          </Title>
        </div>
      ) : (
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
      )}

      {!loading && meta.pageCount > 1 && (
        <Pagination
          current={currentPage}
          total={meta.pageCount * pageSize}
          onChange={handlePageChange}
          pageSize={pageSize}
          showSizeChanger
          onShowSizeChange={(_, newSize) => handlePageChange(1, newSize)}
          style={{ marginTop: '20px', textAlign: 'center' }}
        />
      )}
    </div>
  );
};
