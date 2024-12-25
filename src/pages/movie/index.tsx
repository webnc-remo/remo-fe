import { useMovieDetail } from '../../apis/movie/useMovieDetail';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Spin,
  message,
  Col,
  Row,
  Progress,
  Avatar,
  Modal,
  Form,
  Input,
  Popover,
} from 'antd';
import {
  addMovieToPlaylistUrl,
  axiosInstance,
  createPlaylistUrl,
  getMovieDetailImageUrl,
  noImageUrl,
  removeMovieFromPlaylistUrl,
} from '../../apis';
import { useState } from 'react';
import './movie.css';
import {
  HeartOutlined,
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useToggleFavorite } from '../../apis/user/useToggleFavorite';
import { useCheckUserFavMovie } from '../../apis/user/useCheckUserFavMovie';
import { useAuthStore } from '../../stores/authStore';
import { useToggleWatchlist } from '../../apis/user/useToggleWatchlist';
import { useCheckUserWatchlist } from '../../apis/user/useCheckUserWatchlist';
import { usePlaylistsByMovie } from '../../apis/lists/usePlaylistsByMovie';

const MovieDetailPage = () => {
  const navigate = useNavigate();
  const movieId = useParams().movieId;
  const { movie, loading } = useMovieDetail(movieId ?? '');
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();
  const {
    isFavorite,
    loading: checkLoading,
    refetch,
  } = useCheckUserFavMovie(movieId, {
    enabled: isAuthenticated,
  });

  const { toggleWatchlist, loading: watchlistLoading } = useToggleWatchlist();
  const {
    isWatchlist,
    loading: checkWatchlistLoading,
    refetch: refetchWatchlist,
  } = useCheckUserWatchlist(movieId, {
    enabled: isAuthenticated,
  });

  const { data: moviePlaylists, refetch: refetchPlaylists } =
    usePlaylistsByMovie(movieId, {
      enabled: isAuthenticated,
    });

  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [form] = Form.useForm();
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [deletingPlaylistId, setDeletingPlaylistId] = useState<string | null>(
    null
  );

  const INITIAL_VISIBLE_ITEMS = 6;

  const handleUnauthorizedClick = () => {
    navigate('/login');
    message.info('Please login to use this feature');
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      handleUnauthorizedClick();
      return;
    }

    if (!movieId) return;

    toggleFavorite(
      {
        movieId,
        action: isFavorite ? 'remove' : 'add',
      },
      {
        onSuccess: () => {
          refetch();
          message.success(
            isFavorite ? 'Removed from favorites' : 'Added to favorites'
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          message.error(
            error?.response?.data?.message || 'Failed to update favorite status'
          );
        },
      }
    );
  };

  const handleWatchlistClick = () => {
    if (!isAuthenticated) {
      handleUnauthorizedClick();
      return;
    }

    if (!movieId) return;

    toggleWatchlist(
      {
        movieId,
        action: isWatchlist ? 'remove' : 'add',
      },
      {
        onSuccess: () => {
          refetchWatchlist();
          message.success(
            isWatchlist ? 'Removed from watchlist' : 'Added to watchlist'
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          message.error(
            error?.response?.data?.message ||
              'Failed to update watchlist status'
          );
        },
      }
    );
  };

  const handleCreatePlaylist = async (values: {
    name: string;
    description?: string;
  }) => {
    if (!movieId || !isAuthenticated) {
      handleUnauthorizedClick();
      return;
    }

    setCreatingPlaylist(true);
    try {
      const response = await axiosInstance.post(createPlaylistUrl(), {
        listName: values.name,
        description: values.description,
        imageUrl: '',
      });

      await axiosInstance.post(addMovieToPlaylistUrl(response.data.id), {
        tmdbId: movieId,
      });

      message.success('Movie added to new playlist!');
      setShowCreatePlaylistModal(false);
      form.resetFields();
      refetchPlaylists();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || 'Failed to create playlist'
      );
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const handleRemoveFromPlaylist = async (
    playlistId: string,
    movieId: string
  ) => {
    if (!movieId || !isAuthenticated) {
      handleUnauthorizedClick();
      return;
    }

    setDeletingPlaylistId(playlistId);
    try {
      await axiosInstance.delete(
        removeMovieFromPlaylistUrl(playlistId, movieId),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        }
      );

      message.success('Movie removed from playlist!');
      refetchPlaylists();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 404) {
        message.error('Playlist or movie not found');
      } else {
        message.error('Failed to remove movie from playlist');
      }
    } finally {
      setDeletingPlaylistId(null);
    }
  };

  const PlaylistContent = () => (
    <div style={{ maxWidth: 300 }}>
      {Array.isArray(moviePlaylists) && moviePlaylists.length > 0 ? (
        moviePlaylists.map((playlist) => (
          <div
            key={playlist.id}
            style={{
              padding: '8px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '14px' }}>{playlist.listName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromPlaylist(playlist.id, movieId ?? '');
                }}
                loading={deletingPlaylistId === playlist.id}
              />
            </div>
          </div>
        ))
      ) : (
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            color: '#8c8c8c',
            fontSize: '14px',
            background: '#fafafa',
            borderRadius: '6px',
          }}
        >
          Click the button to add this movie to a playlist
        </div>
      )}
    </div>
  );

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

                  {/* User Interaction Buttons */}
                  <div style={{ display: 'flex', gap: '1em' }}>
                    {isAuthenticated ? (
                      <Popover
                        content={<PlaylistContent />}
                        title="Movie added to playlists:"
                        trigger={['hover', 'click']}
                        placement="right"
                        arrow={true}
                      >
                        <Button
                          type="default"
                          icon={<PlusOutlined />}
                          size="large"
                          style={{
                            borderRadius: '50%',
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                              Array.isArray(moviePlaylists) &&
                              moviePlaylists.length > 0
                                ? 'rgba(147, 51, 234, 0.2)'
                                : 'rgba(255, 255, 255, 0.2)',
                            borderColor:
                              Array.isArray(moviePlaylists) &&
                              moviePlaylists.length > 0
                                ? '#9333ea'
                                : 'white',
                            color:
                              Array.isArray(moviePlaylists) &&
                              moviePlaylists.length > 0
                                ? '#9333ea'
                                : 'white',
                          }}
                          onClick={() => setShowCreatePlaylistModal(true)}
                        />
                      </Popover>
                    ) : (
                      <Button
                        type="default"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                          borderRadius: '50%',
                          width: '45px',
                          height: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderColor: 'white',
                          color: 'white',
                        }}
                        onClick={handleUnauthorizedClick}
                      />
                    )}
                    <Button
                      type="default"
                      icon={<HeartOutlined />}
                      size="large"
                      style={{
                        borderRadius: '50%',
                        width: '45px',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          isAuthenticated && isFavorite
                            ? 'rgba(255, 0, 0, 0.2)'
                            : 'rgba(255, 255, 255, 0.2)',
                        borderColor:
                          isAuthenticated && isFavorite ? '#ff4d4f' : 'white',
                        color:
                          isAuthenticated && isFavorite ? '#ff4d4f' : 'white',
                      }}
                      title={
                        !isAuthenticated
                          ? 'Please login to add to favorites'
                          : isFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                      }
                      onClick={handleFavoriteClick}
                      loading={
                        isAuthenticated && (favoriteLoading || checkLoading)
                      }
                    />
                    <Button
                      type="default"
                      icon={<BookOutlined />}
                      size="large"
                      style={{
                        borderRadius: '50%',
                        width: '45px',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          isAuthenticated && isWatchlist
                            ? 'rgba(0, 128, 0, 0.2)'
                            : 'rgba(255, 255, 255, 0.2)',
                        borderColor:
                          isAuthenticated && isWatchlist ? '#52c41a' : 'white',
                        color:
                          isAuthenticated && isWatchlist ? '#52c41a' : 'white',
                      }}
                      title={
                        !isAuthenticated
                          ? 'Please login to add to watchlist'
                          : isWatchlist
                            ? 'Remove from watchlist'
                            : 'Add to watchlist'
                      }
                      onClick={handleWatchlistClick}
                      loading={
                        isAuthenticated &&
                        (watchlistLoading || checkWatchlistLoading)
                      }
                    />
                  </div>
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

          <Modal
            title="Add to Playlist"
            open={showCreatePlaylistModal && isAuthenticated}
            onCancel={() => setShowCreatePlaylistModal(false)}
            footer={null}
          >
            {Array.isArray(moviePlaylists) && moviePlaylists.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    padding: '16px',
                    background: '#fafafa',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#262626',
                      marginBottom: '12px',
                    }}
                  >
                    Current Playlists
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {moviePlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#fff',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>
                          {playlist.listName}
                        </span>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            handleRemoveFromPlaylist(playlist.id, movieId ?? '')
                          }
                          loading={deletingPlaylistId === playlist.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                borderTop:
                  Array.isArray(moviePlaylists) && moviePlaylists.length > 0
                    ? '1px solid #f0f0f0'
                    : 'none',
                paddingTop:
                  Array.isArray(moviePlaylists) && moviePlaylists.length > 0
                    ? '24px'
                    : 0,
              }}
            >
              <h4
                style={{
                  marginBottom: 16,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Create New Playlist
              </h4>
              <Form
                form={form}
                onFinish={handleCreatePlaylist}
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label="Playlist Name"
                  rules={[
                    { required: true, message: 'Please enter a playlist name' },
                  ]}
                >
                  <Input placeholder="Enter playlist name" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                  <Input.TextArea
                    placeholder="Enter playlist description (optional)"
                    rows={3}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={creatingPlaylist}
                    block
                  >
                    Create & Add Movie
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default MovieDetailPage;
