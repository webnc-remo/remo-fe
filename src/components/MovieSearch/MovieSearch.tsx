import React, { useState } from 'react';
import { Row, Col, Spin, Typography, Pagination } from 'antd';
import { MovieCard } from '../MovieCard';
import { useSearchMovie } from '../../apis/movie/useSearchMovie';
import { useNavigate } from 'react-router-dom';
import { SearchParam } from '../../apis';
import MovieFilterBar from '../MovieFilter';
import { addSearchParamToUrl } from '../../utils/search';
import './MovieSearch.css';

const { Title } = Typography;

export const MovieSearch: React.FC<{
  initialQuery?: string;
  initialPage?: number;
  initialPageSize?: number;
  initialOrder?: 'asc' | 'desc';
  initialYear?: string;
  initialGenre?: string;
  initialRating?: number | null;
}> = ({
  initialQuery = '',
  initialPage = 1,
  initialPageSize = 12,
  initialOrder = 'asc',
  initialYear = '',
  initialGenre = '',
  initialRating = null,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const navigate = useNavigate();

  const query: SearchParam = {
    page: currentPage,
    take: pageSize,
    q: initialQuery,
    order: initialOrder,
    releaseYear: initialYear,
    genre: initialGenre,
    rating: initialRating,
  };

  const { movies, loading, meta } = useSearchMovie(query);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }

    const searchParam = [
      { key: 'query', value: initialQuery },
      { key: 'genre', value: initialGenre },
      { key: 'year', value: initialYear },
      { key: 'page', value: page.toString() },
      { key: 'take', value: newPageSize?.toString() ?? pageSize.toString() },
    ];

    navigate(addSearchParamToUrl(searchParam), { replace: true });
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <div className='searchfilter-wrapper--responsive'>
        <Title level={3} style={{ textAlign: 'center'}}>
          Keyword: "{initialQuery}"
        </Title>
        <MovieFilterBar query={query}/>
      </div>

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
        <div className="flex justify-center mt-5">
          <Pagination
            current={currentPage}
            total={meta.pageCount * pageSize}
            onChange={handlePageChange}
            pageSize={pageSize}
            showSizeChanger
            onShowSizeChange={(_, newSize) => handlePageChange(1, newSize)}
          />
        </div>
      )}
    </div>
  );
};
