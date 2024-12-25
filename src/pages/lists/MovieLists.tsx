import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Empty, Pagination, Select, message } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '../../apis/user/useUserPlaylists';
import MovieCardInList from '../../components/MovieCardInList';
import { Movie } from '../../interface/movie.interface';
import { axiosInstance } from '../../apis';
import { usePlaylistDetail } from '../../apis/lists/usePlaylistDetail';

const { Option } = Select;

const MovieLists: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get playlistId from URL or null for initial state
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(() => {
    return searchParams.get('playlistId') ?? '';
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const size = searchParams.get('size');
    return size ? parseInt(size) : 10;
  });

  // Fetch all playlists
  const {
    data: playlists,
    isLoading: playlistsLoading
  } = useUserPlaylists();

  // Set initial playlist if none selected
  useEffect(() => {
    if (playlists?.length && !selectedPlaylistId) {
      const firstPlaylistId = playlists[0].id;
      setSelectedPlaylistId(firstPlaylistId);
      setSearchParams(prev => {
        prev.set('playlistId', firstPlaylistId);
        return prev;
      });
    }
  }, [playlists, selectedPlaylistId, setSearchParams]);

  // Fetch selected playlist details
  const {
    data: playlistDetail,
    isLoading: detailLoading,
    refetch: refetchPlaylist
  } = usePlaylistDetail(selectedPlaylistId, {
    page: currentPage,
    take: pageSize,
  });

  // Update URL when page or size changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    if (selectedPlaylistId) {
      params.set('playlistId', selectedPlaylistId);
    }
    navigate(`/lists?${params.toString()}`, { replace: true });
  }, [currentPage, pageSize, selectedPlaylistId, navigate, searchParams]);

  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handlePlaylistChange = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setCurrentPage(1);
  };

  const handleRemoveFromPlaylist = async (movieId: number) => {
    try {
      await axiosInstance.delete(
        `/playlists/${selectedPlaylistId}/movies/${movieId}`
      );
      message.success('Movie removed from playlist');
      if (playlistDetail?.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        refetchPlaylist();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error('Failed to remove movie from playlist');
    }
  };

  if (playlistsLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!playlists?.length) {
    return <Empty description="No playlists found" className="mt-8" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Lists</h1>
        <Select
          style={{ width: 300 }}
          value={selectedPlaylistId}
          onChange={handlePlaylistChange}
          loading={playlistsLoading}
        >
          {playlists?.map((playlist) => (
            <Option key={playlist.id} value={playlist.id}>
              {playlist.listName} ({playlist.items?.length ?? 0} movies)
            </Option>
          ))}
        </Select>
      </div>

      <div className="relative">
        {detailLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}

        {!playlistDetail?.length ? (
          <Empty description="No movies in this playlist" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {playlistDetail.map((movie: Movie) => (
                <Col xs={24} md={12} key={movie.id}>
                  <MovieCardInList
                    movie={movie}
                    onRemove={() => handleRemoveFromPlaylist(movie.id)}
                    removeButtonText="Remove"
                    removeConfirmTitle="Remove from playlist"
                    removeConfirmDescription="Are you sure you want to remove this movie from this playlist?"
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
    </div>
  );
};

export default MovieLists;
