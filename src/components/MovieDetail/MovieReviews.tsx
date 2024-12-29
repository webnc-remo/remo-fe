import { Row, Col, Card, Avatar, Empty, Spin } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetMovieRatingReviews } from '../../apis/movie/useGetMovieRatingReviews';
import { useEffect } from 'react';

interface MovieReviewsProps {
  movieId: string;
  onRefetchReviews: (refetch: () => void) => void;
}

export const MovieReviews: React.FC<MovieReviewsProps> = ({
  movieId,
  onRefetchReviews,
}) => {
  const {
    data: movieReviews,
    isLoading: reviewsLoading,
    refetch,
  } = useGetMovieRatingReviews(movieId);

  useEffect(() => {
    if (refetch) {
      onRefetchReviews(refetch);
    }
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return '#52c41a';
    if (rating >= 60) return '#1890ff';
    if (rating >= 40) return '#faad14';
    return '#f5222d';
  };

  return (
    <div style={{ padding: '2vw' }}>
      <h2
        style={{
          fontSize: '1.5em',
          fontWeight: 'bold',
          marginBottom: '1em',
        }}
      >
        User Reviews
      </h2>
      {reviewsLoading ? (
        <Spin />
      ) : movieReviews && movieReviews.length > 0 ? (
        <Row gutter={[16, 16]}>
          {movieReviews.map((review) => (
            <Col xs={24} sm={24} md={12} lg={8} key={review.id}>
              <Card>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Avatar
                    icon={<UserOutlined />}
                    src={review.user.avatar}
                    style={{ marginRight: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {review.user.fullName || 'Anonymous User'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.85em',
                        color: '#666',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span>{review.user.email}</span>
                      <span>
                        {dayjs(review.createdAt).format('MMMM D, YYYY')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Display */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <StarFilled
                    style={{
                      color: getRatingColor(review.rating),
                      marginRight: '8px',
                      fontSize: '18px',
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: getRatingColor(review.rating),
                      fontSize: '16px',
                    }}
                  >
                    {review.rating}/100
                  </span>
                </div>

                {/* Review Text */}
                {review.review && (
                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      backgroundColor: '#fff',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    {review.review}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No reviews yet" />
      )}
    </div>
  );
};
