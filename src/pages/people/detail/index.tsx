import { Link } from 'react-router-dom';
import { Row, Col, Avatar, Typography, Tag, Divider, Button } from 'antd';
import { getMovieDetailImageUrl } from '../../../apis'
import { usePeopleDetail } from '../../../apis/people/usePeopleDetail';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { noImageUrl } from '../../../apis';
import { Spin } from 'antd';

const { Title, Text, Paragraph } = Typography;
const PeopleDetailPage = () => {
  const { peopleId } = useParams();
  const { people, loading } = usePeopleDetail(peopleId ?? '');
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);
  const INITIAL_VISIBLE_ITEMS = 6;

  return loading ? (
    <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }} />
  ) : (
    <div className="responsive-container" style={{ padding: '2vw' }}>
      {/* Personal Information Section */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={8} md={6}>
          <Avatar
            src={
              people?.profile_path ? getMovieDetailImageUrl(people?.profile_path) : noImageUrl

            }
            size={300}
            shape="square"
            style={{ width: '100%', height: 'auto' }}
          />
        </Col>
        <Col xs={24} sm={16} md={18}>
          <Title level={1}>{people?.name}</Title>
          <div style={{ marginBottom: '1.5em' }}>
            <Text strong>Birthday:</Text>{' '}
            <Text>{people?.birthday || 'Unknown'}</Text>
            {people?.place_of_birth && (
              <>
                <br />
                <Text strong>Place of Birth:</Text>{' '}
                <Text>{people?.place_of_birth}</Text>
              </>
            )}
            {people?.deathday && (
              <>
                <br />
                <Text strong>Deathday:</Text> <Text>{people?.deathday}</Text>
              </>
            )}

          </div>
          {people?.also_known_as && people?.also_known_as.length > 0 && (
            <div style={{ marginBottom: '1.5em' }}>
              <Text strong>Also Known As:</Text>
              <div style={{ marginTop: '0.5em' }}>
                {people?.also_known_as.map((name, index) => (
                  <Tag key={index} style={{ marginBottom: '0.5em' }}>
                    {name}
                  </Tag>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginBottom: '1.5em' }}>
            <Title level={3}>Biography</Title>
            <Paragraph>
              {people?.biography || 'No biography available.'}
            </Paragraph>
          </div>
        </Col>
      </Row>
      {/* Cast Section */}
      {people?.movie_credits?.cast && people?.movie_credits.cast.length > 0 && (
        <>
          <Divider />
          <div style={{ marginTop: '2em' }}>
            <Title level={2}>Acting</Title>
            <Row gutter={[16, 16]}>
              {people?.movie_credits.cast
                .slice(0, showAllCast ? undefined : INITIAL_VISIBLE_ITEMS)
                .map((movie) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={movie.id}>
                    <Link to={`/movie/${movie.id}`}>
                      <div style={{ textAlign: 'center' }}>
                        <img
                          src={
                            movie.backdrop_path
                              ? getMovieDetailImageUrl(movie.backdrop_path)
                              : noImageUrl
                          }
                          alt={movie.title}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '8px',
                          }}
                        />
                        <Title level={5} style={{ margin: '8px 0', fontSize: '1em' }}>
                          {movie.title}
                        </Title>
                        {movie.character && <Text type="secondary" style={{ fontSize: '0.9em' }}>
                          as {movie.character}
                        </Text>}
                      </div>
                    </Link>
                  </Col>
                ))}
            </Row>
            {people.movie_credits.cast.length > INITIAL_VISIBLE_ITEMS && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button onClick={() => setShowAllCast(!showAllCast)}>
                  {showAllCast ? 'Show Less' : `View More (${people.movie_credits.cast.length - INITIAL_VISIBLE_ITEMS} more)`}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      {/* Crew Section */}
      {people?.movie_credits?.crew && people?.movie_credits.crew.length > 0 && (
        <>
          <Divider />
          <div style={{ marginTop: '2em' }}>
            <Title level={2}>Crew</Title>
            <Row gutter={[16, 16]}>
              {people?.movie_credits.crew
                .slice(0, showAllCrew ? undefined : INITIAL_VISIBLE_ITEMS)
                .map((movie) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={`${movie.id}-${movie.character}`}>
                    <Link to={`/movie/${movie.id}`}>
                      <div style={{ textAlign: 'center' }}>
                        <img
                          src={
                            movie.backdrop_path
                              ? getMovieDetailImageUrl(movie.backdrop_path)
                              : noImageUrl
                          }
                          alt={movie.title}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '8px',
                          }}
                        />
                        <Title level={5} style={{ margin: '8px 0', fontSize: '1em' }}>
                          {movie.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '0.9em' }}>
                          {movie.character}
                        </Text>
                      </div>
                    </Link>
                  </Col>
                ))}
            </Row>
            {people.movie_credits.crew.length > INITIAL_VISIBLE_ITEMS && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button onClick={() => setShowAllCrew(!showAllCrew)}>
                  {showAllCrew ? 'Show Less' : `View More (${people.movie_credits.crew.length - INITIAL_VISIBLE_ITEMS} more)`}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PeopleDetailPage;
