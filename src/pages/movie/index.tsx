import { useMovieDetail } from '../../apis/movie/useMovieDetail';
import { useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { getMovieDetailImageUrl, noImageUrl } from '../../apis';
import { Col, Row, Progress, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './movie.css';

const MovieDetailPage = () => {
  const movieId = useParams().movieId;
  const { movie, loading } = useMovieDetail(movieId ?? '');
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);

  const INITIAL_VISIBLE_ITEMS = 6;

  return (
    <div>
      {loading ? (
        <Spin
          size="large"
          style={{
            width: '100%',
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ) : (
        <>
          <Row
            style={{
              padding: '2vw',
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7)), url(${movie?.backdrop_path ? getMovieDetailImageUrl(movie?.backdrop_path) : noImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              color: 'white',
            }}
          >
            <Col
              xs={24}
              sm={24}
              md={10}
              xl={7}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <img
                src={
                  movie?.poster_path
                    ? getMovieDetailImageUrl(movie?.poster_path)
                    : noImageUrl
                }
                style={{
                  borderRadius: '10px',
                }}
                alt={movie?.title}
              />
            </Col>

            <Col
              xs={24}
              sm={24}
              md={14}
              xl={15}
              style={{
                fontSize: '1.5em',
                padding: '0 3vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Row justify={{ xs: 'center', md: 'start' }}>
                <Col style={{ fontSize: '1.5em' }}>
                  <h1 style={{ fontSize: '2em', fontWeight: 'bold' }}>
                    {movie?.title}
                  </h1>
                  <h1>
                    {movie?.release_date} |{' '}
                    {movie?.genres?.map((genre) => genre.name).join(', ')}
                  </h1>
                </Col>
              </Row>

              <div>
                <h1
                  style={{
                    fontWeight: 'bold',
                    marginTop: '1.5em',
                    marginBottom: '0.5em',
                  }}
                >
                  RATING
                </h1>
                <Progress
                  size={90}
                  style={{ fontWeight: 'bold' }}
                  strokeWidth={8}
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  type="circle"
                  percent={
                    movie?.vote_average
                      ? Math.floor(movie?.vote_average * 10)
                      : 0
                  }
                />
                <b style={{ marginLeft: '0.5em' }}>User score</b>
              </div>

              <div>
                <p
                  style={{
                    marginTop: '1.5em',
                    marginBottom: '1em',
                    fontStyle: 'italic',
                  }}
                >
                  {movie?.tagline || 'No tagline'}
                </p>
                <h1 style={{ fontWeight: 'bold' }}>OVERVIEW</h1>
                <p>{movie?.overview}</p>
              </div>
            </Col>
          </Row>

          {/* Cast Section */}
          {movie?.credits?.cast && movie.credits.cast.length > 0 && (
            <div style={{ padding: '2vw' }}>
              <h2
                style={{
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  marginBottom: '1em',
                }}
              >
                Cast
              </h2>
              <Row gutter={[16, 16]}>
                {movie.credits.cast
                  .slice(0, showAllCast ? undefined : INITIAL_VISIBLE_ITEMS)
                  .map((person) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={person.id}>
                      <Link to={`/people/${person.id}`}>
                        <div style={{ textAlign: 'center' }}>
                          <Avatar
                            src={
                              person.profile_path
                                ? getMovieDetailImageUrl(person.profile_path)
                                : noImageUrl
                            }
                            size={100}
                            style={{ marginBottom: '8px' }}
                          />
                          <h3
                            style={{
                              margin: '0',
                              fontSize: '1em',
                              fontWeight: 'bold',
                            }}
                          >
                            {person.name}
                          </h3>
                          <p
                            style={{
                              margin: '4px 0',
                              fontSize: '0.9em',
                              color: '#666',
                            }}
                          >
                            {person.character}
                          </p>
                        </div>
                      </Link>
                    </Col>
                  ))}
              </Row>
              {movie.credits.cast.length > INITIAL_VISIBLE_ITEMS && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button onClick={() => setShowAllCast(!showAllCast)}>
                    {showAllCast
                      ? 'Show Less'
                      : `View More (${movie.credits.cast.length - INITIAL_VISIBLE_ITEMS} more)`}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Crew Section */}
          {movie?.credits?.crew && movie.credits.crew.length > 0 && (
            <div style={{ padding: '2vw' }}>
              <h2
                style={{
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  marginBottom: '1em',
                }}
              >
                Crew
              </h2>
              <Row gutter={[16, 16]}>
                {movie.credits.crew
                  .slice(0, showAllCrew ? undefined : INITIAL_VISIBLE_ITEMS)
                  .map((person) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={person.id}>
                      <Link to={`/people/${person.id}`}>
                        <div style={{ textAlign: 'center' }}>
                          <Avatar
                            src={
                              person.profile_path
                                ? getMovieDetailImageUrl(person.profile_path)
                                : noImageUrl
                            }
                            size={100}
                            style={{ marginBottom: '8px' }}
                          />
                          <h3
                            style={{
                              margin: '0',
                              fontSize: '1em',
                              fontWeight: 'bold',
                            }}
                          >
                            {person.name}
                          </h3>
                        </div>
                      </Link>
                    </Col>
                  ))}
              </Row>
              {movie.credits.crew.length > INITIAL_VISIBLE_ITEMS && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button onClick={() => setShowAllCrew(!showAllCrew)}>
                    {showAllCrew
                      ? 'Show Less'
                      : `View More (${movie.credits.crew.length - INITIAL_VISIBLE_ITEMS} more)`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetailPage;
