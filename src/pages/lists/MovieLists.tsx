import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spin,
  Empty,
  Pagination,
  Select,
  message,
  Button,
  Modal,
  Form,
  Input,
} from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShareAltOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useUserPlaylists } from '../../apis/user/useUserPlaylists';
import MovieCardInList from '../../components/MovieCardInList';
import { Movie } from '../../interface/movie.interface';
import {
  axiosInstance,
  deletePlaylistUrl,
  removeMovieFromPlaylistUrl,
  updatePlaylistUrl,
} from '../../apis';
import { usePlaylistDetail } from '../../apis/lists/usePlaylistDetail';
import { useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

const MovieLists: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const [shareLoading, setShareLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form] = Form.useForm();

  const {
    data: playlists,
    isLoading: playlistsLoading,
    refetch: refetchPlaylists,
  } = useUserPlaylists();

  const {
    data: playlistDetail,
    isLoading: detailLoading,
    refetch: refetchPlaylist,
  } = usePlaylistDetail(selectedPlaylistId, {
    page: currentPage,
    take: pageSize,
  });

  useEffect(() => {
    if (playlists?.length && !selectedPlaylistId) {
      const firstPlaylistId = playlists[0].id;
      setSelectedPlaylistId(firstPlaylistId);
      updateUrl(1, pageSize, firstPlaylistId);
    }
  }, [playlists]);

  const updateUrl = (page: number, size: number, playlistId: string) => {
    const params = new URLSearchParams(searchParams);
    const currentPlaylistId = params.get('playlistId');
    const currentPage = params.get('page');
    const currentSize = params.get('size');

    if (
      currentPlaylistId !== playlistId ||
      currentPage !== page.toString() ||
      currentSize !== size.toString()
    ) {
      params.set('page', page.toString());
      params.set('size', size.toString());
      params.set('playlistId', playlistId);
      navigate(`?${params.toString()}`);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
      updateUrl(1, size, selectedPlaylistId);
    } else {
      setCurrentPage(page);
      updateUrl(page, pageSize, selectedPlaylistId);
    }
  };

  const handlePlaylistChange = (playlistId: string) => {
    if (playlistId !== selectedPlaylistId) {
      setSelectedPlaylistId(playlistId);
      setCurrentPage(1);
      updateUrl(1, pageSize, playlistId);
    }
  };

  const handleRemoveFromPlaylist = async (movieId: number) => {
    try {
      await axiosInstance.delete(
        removeMovieFromPlaylistUrl(selectedPlaylistId, movieId.toString())
      );

      message.success('Movie removed from playlist');

      await Promise.all([refetchPlaylist(), refetchPlaylists()]);

      // Update page if necessary
      if (playlistDetail?.items?.length === 1 && currentPage > 1) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        updateUrl(newPage, pageSize, selectedPlaylistId);
      }

      queryClient.invalidateQueries({
        queryKey: ['playlists', 'movie'],
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error('Failed to remove movie from playlist');
    }
  };

  const handleShare = async () => {
    if (selectedPlaylistId) {
      setShareLoading(true);
      try {
        const shareUrl = `${window.location.origin}/share/list/${selectedPlaylistId}`;
        await navigator.clipboard.writeText(shareUrl);
        message.success('Share link copied to clipboard!');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error('Failed to copy share link');
      } finally {
        setShareLoading(false);
      }
    }
  };

  const handleEdit = async (values: {
    listName: string;
    description?: string;
  }) => {
    if (!selectedPlaylistId) return;

    setIsUpdating(true);
    try {
      await axiosInstance.put(updatePlaylistUrl(selectedPlaylistId), values);

      message.success('Playlist updated successfully');
      await Promise.all([refetchPlaylists(), refetchPlaylist()]);
      setIsEditModalVisible(false);
      form.resetFields();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error('Failed to update playlist');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlaylistId) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(deletePlaylistUrl(selectedPlaylistId));

      message.success('Playlist deleted successfully');
      await refetchPlaylists();

      // Select first playlist after deletion if available
      if (playlists && playlists.length > 1) {
        const nextPlaylist = playlists.find((p) => p.id !== selectedPlaylistId);
        if (nextPlaylist) {
          setSelectedPlaylistId(nextPlaylist.id);
          updateUrl(1, pageSize, nextPlaylist.id);
        }
      } else {
        setSelectedPlaylistId('');
      }

      setIsDeleteModalVisible(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error('Failed to delete playlist');
    } finally {
      setIsDeleting(false);
    }
  };

  const isInitialLoading = !playlists && playlistsLoading;
  const isContentLoading =
    selectedPlaylistId && !playlistDetail && detailLoading;

  if (isInitialLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Lists</h1>
          <div style={{ width: 300 }}>
            <Spin />
          </div>
        </div>
      </div>
    );
  }

  if (!playlists?.length) {
    return <Empty description="No playlists found" className="mt-8" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My Lists</h1>
          {selectedPlaylistId && (
            <>
              <Button
                type="primary"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                loading={shareLoading}
                className="flex items-center"
              >
                {shareLoading ? 'Copying...' : 'Share List'}
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  const currentPlaylist = playlists?.find(
                    (p) => p.id === selectedPlaylistId
                  );
                  form.setFieldsValue({
                    listName: currentPlaylist?.listName,
                    description: currentPlaylist?.description,
                  });
                  setIsEditModalVisible(true);
                }}
              >
                Edit
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
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
        {isContentLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {!playlistDetail?.items?.length ? (
              <Empty description="No movies in this playlist" />
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {playlistDetail.items.map((movie: Movie) => (
                    <Col xs={24} md={12} key={movie.id}>
                      <MovieCardInList
                        movie={movie}
                        onRemove={() => handleRemoveFromPlaylist(movie.tmdb_id)}
                        removeButtonText="Remove"
                        removeConfirmTitle="Remove from playlist"
                        removeConfirmDescription="Are you sure you want to remove this movie from this playlist?"
                      />
                    </Col>
                  ))}
                </Row>

                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={playlistDetail?.meta?.itemCount ?? 0}
                    onChange={handlePageChange}
                    showSizeChanger
                    showTotal={(total) => `Total ${total} movies`}
                    pageSizeOptions={['10', '20', '30', '40']}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Playlist"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        style={{
          top: '20%',
        }}
      >
        <Form
          form={form}
          onFinish={handleEdit}
          layout="vertical"
          style={{ marginTop: '12px' }}
        >
          <Form.Item
            name="listName"
            label="Playlist Name"
            rules={[{ required: true, message: 'Please enter playlist name' }]}
          >
            <Input placeholder="Enter playlist name" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Enter playlist description (optional)"
              rows={6}
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Button
              className="mr-2"
              size="large"
              onClick={() => {
                setIsEditModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              size="large"
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Playlist"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        confirmLoading={isDeleting}
        okText="Delete"
        okButtonProps={{ danger: true }}
        onOk={handleDelete}
      >
        <p>
          Are you sure you want to delete this playlist? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default MovieLists;
