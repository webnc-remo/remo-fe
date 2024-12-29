import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetUserRatings } from '../../apis/user/useGetUserRatings';
import { Row, Col, Pagination, Empty, Spin, Typography } from 'antd';
import RatingCardInList from '../../components/MovieDetail/RatingCardInList';

const { Title } = Typography;

export const RatingList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(() => {
        const page = searchParams.get('page');
        return page ? parseInt(page) : 1;
    });

    const [pageSize, setPageSize] = useState(() => {
        const size = searchParams.get('size');
        return size ? parseInt(size) : 10;
    });

    const { data: ratingsData, isLoading, isFetching } = useGetUserRatings(
        currentPage,
        pageSize
    );

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('size', pageSize.toString());
        navigate(`/ratings?${params.toString()}`, { replace: true });
    }, [currentPage, pageSize, navigate]);

    const handlePageChange = (page: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            setCurrentPage(1);
        } else {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!ratingsData?.items.length) {
        return (
            <div style={{ padding: '50px' }}>
                <Empty description="No ratings yet" />
            </div>
        );
    }

    // Chia items thành 2 mảng cho 2 cột
    const midPoint = Math.ceil(ratingsData.items.length / 2);
    const leftColumnItems = ratingsData.items.slice(0, midPoint);
    const rightColumnItems = ratingsData.items.slice(midPoint);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '24px' }}>
            <div className="text-center mb-6">
                <Title level={2}>My Ratings</Title>
            </div>

            {isFetching ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            ) : (
                <Row gutter={24} justify="center">
                    {/* Left Column */}
                    <Col xs={24} lg={11}>
                        <div className="space-y-4">
                            {leftColumnItems.map((item) => (
                                <RatingCardInList
                                    key={item.id}
                                    movie={item.movie}
                                    rating={item.rating}
                                    review={item.review}
                                    createdAt={item.createdAt}
                                />
                            ))}
                        </div>
                    </Col>

                    {/* Right Column */}
                    <Col xs={24} lg={11}>
                        <div className="space-y-4">
                            {rightColumnItems.map((item) => (
                                <RatingCardInList
                                    key={item.id}
                                    movie={item.movie}
                                    rating={item.rating}
                                    review={item.review}
                                    createdAt={item.createdAt}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
            )}

            {/* Pagination centered */}
            {ratingsData.meta && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={ratingsData.meta.itemCount}
                        onChange={handlePageChange}
                        showSizeChanger
                        showTotal={(total) => `Total ${total} movies`}
                        pageSizeOptions={['10', '20', '30', '40']}
                    />
                </div>
            )}
        </div>
    );
}; 
