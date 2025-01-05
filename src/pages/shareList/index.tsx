import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, Empty, Typography, Pagination } from 'antd';
import { useGetSharedList } from '../../apis/lists/useGetSharedList';
import MovieCardInList from '../../components/MovieCardInList';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';

const { Title } = Typography;

const ShareList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const size = searchParams.get('take');
    return size ? parseInt(size) : 10;
  });

  const { movies, listInfo, meta, loading } = useGetSharedList({
    listId: id ?? '',
    page: currentPage,
    take: pageSize,
    order: 'asc',
  });

  const getMetaDescription = () => {
    if (!listInfo) return '';
    const movieCount = meta?.itemCount || 0;
    const creatorName = listInfo.user.fullname || listInfo.user.email || 'Anonymous';
    return `A movie collection "${listInfo.listName}" created by ${creatorName}. Contains ${movieCount} movies.`;
  };

  const getMetaImage = () => {
    if (!movies?.length) return '';
    return movies[0].poster_path || '';
  };

  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }

    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    if (size) params.set('take', size.toString());
    navigate(`?${params.toString()}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!listInfo) {
    return (
      <Empty
        description="List not found or has been removed"
        className="mt-8"
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${listInfo.listName} - Movie List`}</title>
        <meta name="description" content={getMetaDescription()} />

        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${listInfo.listName} - Movie List`} />
        <meta property="og:description" content={getMetaDescription()} />
        {getMetaImage() && <meta property="og:image" content={getMetaImage()} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={window.location.hostname} />
        <meta property="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={`${listInfo.listName} - Movie List`} />
        <meta name="twitter:description" content={getMetaDescription()} />
        {getMetaImage() && <meta name="twitter:image" content={getMetaImage()} />}
      </Helmet>

      <div className="p-6">
        <div className="mb-8">
          <Title level={2} className="text-3xl font-bold mb-2">
            {listInfo.listName} List
          </Title>

          <div className="flex flex-col gap-2 mt-4 text-gray-600">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-blue-500" />
              <span className="font-medium">Creator:</span>
              <span className="text-gray-800">
                {listInfo.user.fullname || listInfo.user.email || ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-green-500" />
              <span className="font-medium">Created:</span>
              <span className="text-gray-800">
                {new Date(listInfo.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {movies && movies.length === 0 ? (
          <Empty description="No movies in this list" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {movies?.map((movie) => (
                <Col xs={24} md={12} key={movie.id}>
                  <MovieCardInList movie={movie} showRemoveButton={false} />
                </Col>
              ))}
            </Row>

            {meta && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={meta.itemCount}
                  onChange={handlePageChange}
                  showSizeChanger
                  showTotal={(total) => `Total ${total} movies`}
                  pageSizeOptions={['10', '20', '30', '40']}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ShareList;
