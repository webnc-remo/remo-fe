import { useMovieDetail } from '../../apis/movie/useMovieDetail';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { getMovieDetailImageUrl, noImageUrl } from '../../apis';
import { Col, Row, Progress } from 'antd';
import './movie.css';

const MovieDetailPage = () => {
  const movieId = useParams().movieId;
  const { movie, loading } = useMovieDetail(movieId ?? '');

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
                  movie?.vote_average ? Math.floor(movie?.vote_average * 10) : 0
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
      )}
    </div>
  );
};

export default MovieDetailPage;
