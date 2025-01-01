import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { getMovieDetailImageUrl, noImageUrl } from '../apis';
import { Movie } from '../interface/movie.interface';

export const RecommendationCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`}>
      <Card
        style={{ width: '100%', padding: '0' }}
        styles={{ body: { padding: '10px 0' } }}
        cover={
          <img
            alt={movie.title}
            src={
              movie.poster_path
                ? getMovieDetailImageUrl(movie.poster_path)
                : noImageUrl
            }
            style={{
              width: '100%',
              height: '140px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              marginRight: '8px',
            }}
          >
            {movie.title}
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {Math.floor(movie.vote_average * 10)}%
          </div>
        </div>
      </Card>
    </Link>
  );
}; 