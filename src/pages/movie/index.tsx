import { useMovieDetail } from '../../apis/movie/useMovieDetail';
import { useParams, Link } from 'react-router-dom';
import { Button, Spin, Col, Row, Progress, Avatar, Tooltip } from 'antd';
import { getMovieDetailImageUrl, noImageUrl } from '../../apis';
import { useState } from 'react';
import './movie.css';
import { useAuthStore } from '../../stores/authStore';
import { ActionButtons } from '../../components/MovieDetail/ActionButtons';
import { CreatePlaylistModal } from '../../components/MovieDetail/CreatePlaylistModal';
import { RatingModal } from '../../components/MovieDetail/RatingModal';
import { StarOutlined } from '@ant-design/icons';
import { useRateMovie } from '../../apis/movie/useRateMovie';
import { useGetUserRating } from '../../apis/movie/useGetUserRating';
import { MovieReviews } from '../../components/MovieDetail/MovieReviews';
import { useSimilarMovies } from '../../apis/movie/useSimilarMovies';
import { RecommendationCard } from '../../components/RecommendationCard';

const MovieDetailPage = () => {
  const movieId = useParams().movieId;
  const { movie, loading } = useMovieDetail(movieId ?? '');
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { similarMovies } = useSimilarMovies(movieId ?? '');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const INITIAL_VISIBLE_ITEMS = 6;

  const { mutate: rateMovie, isPending: ratingLoading } = useRateMovie();
  const { data: userRating, isLoading: userRatingLoading } = useGetUserRating(
    isAuthenticated ? (movieId ?? '') : ''
  );

  const [refetchReviews, setRefetchReviews] = useState<(() => void) | null>(
    null
  );

  const handleRating = async (rating: number, review: string) => {
    rateMovie(
      {
        movieId: movieId ?? '',
        rating,
        review,
        isUpdate: !!userRating,
      },
      {
        onSuccess: () => {
          setShowRatingModal(false);
          if (refetchReviews) {
            refetchReviews();
          }
        },
      }
    );
  };

  const handleRefetchReviews = (refetch: () => void) => {
    setRefetchReviews(() => refetch);
  };

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
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '2em' }}
                >
                  <div>
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

                  {isAuthenticated && (
                    <Tooltip
                      title={
                        userRatingLoading
                          ? 'Loading...'
                          : userRating
                            ? `Your rating: ${userRating.rating}/100${userRating.review ? ` - "${userRating.review}"` : ''}`
                            : 'Rate this movie'
                      }
                    >
                      <Button
                        icon={
                          <StarOutlined
                            style={{
                              color: userRating ? '#fadb14' : undefined,
                            }}
                          />
                        }
                        onClick={() => setShowRatingModal(true)}
                        type={userRating ? 'default' : 'primary'}
                        ghost={!userRating}
                        loading={userRatingLoading}
                        style={{
                          backgroundColor: userRating
                            ? 'rgba(250, 219, 20, 0.1)'
                            : undefined,
                          borderColor: userRating ? '#fadb14' : undefined,
                          color: userRating ? '#fadb14' : undefined,
                        }}
                      >
                        {userRating ? 'Update Rating' : 'Rate This Movie'}
                      </Button>
                    </Tooltip>
                  )}

                  <ActionButtons
                    movieId={movieId ?? ''}
                    isAuthenticated={isAuthenticated}
                    onOpenPlaylistModal={() => setShowCreatePlaylistModal(true)}
                  />
                </div>
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

          {/* Similar Movies Section */}
          {similarMovies && similarMovies.length > 0 && (
            <div style={{ padding: '2vw' }}>
              <h2
                style={{
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  marginBottom: '1em',
                }}
              >
                Similar Movies
              </h2>
              <Row
                gutter={[16, 16]}
                style={{
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  margin: '0 auto',
                }}
              >
                {similarMovies.map((movie) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} key={movie.id}>
                    <RecommendationCard movie={movie} />
                  </Col>
                ))}
              </Row>
            </div>
          )}

          <MovieReviews
            movieId={movieId ?? ''}
            onRefetchReviews={handleRefetchReviews}
          />
        </>
      )}

      {isAuthenticated && (
        <>
          <CreatePlaylistModal
            isOpen={showCreatePlaylistModal}
            onClose={() => setShowCreatePlaylistModal(false)}
            movieId={movieId ?? ''}
          />
          <RatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleRating}
            loading={ratingLoading}
            initialRating={userRating?.rating}
            initialReview={userRating?.review}
          />
        </>
      )}
    </div>
  );
};

export default MovieDetailPage;
