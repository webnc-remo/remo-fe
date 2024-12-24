import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, Empty, Typography, Pagination } from 'antd';
import { useGetSharedList } from '../../apis/lists/useGetSharedList';
import MovieCardInList from '../../components/MovieCardInList';

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
        order: 'asc'
    });

    console.log('hehe2', movies);

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
        <div className="p-6">
            <div className="mb-8">
                <Title level={2}>{listInfo.listName} List</Title>

                <div className="text-sm text-gray-500 mt-4">
                    <p>Shared by: {listInfo.user.fullname} </p>
                </div>
            </div>

            {movies && movies.length === 0 ? (
                <Empty description="No movies in this list" />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {movies?.map((movie) => (
                            <Col xs={24} md={12} key={movie.id}>
                                <MovieCardInList
                                    movie={movie}
                                    showRemoveButton={false}
                                />
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
    );
};

export default ShareList;
