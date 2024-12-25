import { Modal, Form, Input, Button, message, List, Tooltip } from 'antd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    addMovieToPlaylistUrl,
    axiosInstance,
    createPlaylistUrl,
} from '../../apis';
import { useUserPlaylists } from '../../apis/user/useUserPlaylists';
import { usePlaylistsByMovie } from '../../apis/lists/usePlaylistsByMovie';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useRemoveFromPlaylist } from '../../apis/user/useRemoveFromPlaylist';

interface CreatePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    movieId: string;
}

const INITIAL_VISIBLE_ITEMS = 3; // Số lượng items hiển thị ban đầu

export const CreatePlaylistModal = ({
    isOpen,
    onClose,
    movieId,
}: CreatePlaylistModalProps) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);
    const [showAllAdded, setShowAllAdded] = useState(false);
    const [showAllAvailable, setShowAllAvailable] = useState(false);
    const queryClient = useQueryClient();
    const { removeFromPlaylist, isLoading: isRemoving } = useRemoveFromPlaylist();

    const { data: userPlaylists } = useUserPlaylists();
    const { data: moviePlaylists } = usePlaylistsByMovie(movieId);

    const addedPlaylists =
        userPlaylists?.filter((playlist) =>
            moviePlaylists?.some((mp) => mp.id === playlist.id)
        ) || [];

    const availablePlaylists =
        userPlaylists?.filter(
            (playlist) => !moviePlaylists?.some((mp) => mp.id === playlist.id)
        ) || [];

    const handleSubmit = async (values: {
        name: string;
        description?: string;
    }) => {
        if (!movieId) return;

        setIsSubmitting(true);
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
            form.resetFields();
            onClose();

            queryClient.invalidateQueries({
                queryKey: ['playlists', 'movie', movieId],
            });
            queryClient.invalidateQueries({
                queryKey: ['user-playlists'],
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            message.error(
                error?.response?.data?.message || 'Failed to create playlist'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddToExistingPlaylist = async (playlistId: string) => {
        setAddingToPlaylist(playlistId);
        try {
            await axiosInstance.post(addMovieToPlaylistUrl(playlistId), {
                tmdbId: movieId,
            });

            message.success('Movie added to playlist!');
            queryClient.invalidateQueries({
                queryKey: ['playlists', 'movie', movieId],
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            message.error(
                error?.response?.data?.message || 'Failed to add movie to playlist'
            );
        } finally {
            setAddingToPlaylist(null);
        }
    };

    const handleRemoveFromPlaylist = (playlistId: string) => {
        removeFromPlaylist(
            { playlistId, movieId },
            {
                onSuccess: () => {
                    message.success('Movie removed from playlist');
                    queryClient.invalidateQueries({
                        queryKey: ['playlists', 'movie', movieId],
                    });
                },
                onError: () => {
                    message.error('Failed to remove movie from playlist');
                },
            }
        );
    };

    const renderPlaylistSection = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playlists: any[],
        isAdded: boolean,
        showAll: boolean,
        setShowAll: (value: boolean) => void,
        title: string
    ) => {
        const displayedPlaylists = showAll
            ? playlists
            : playlists.slice(0, INITIAL_VISIBLE_ITEMS);

        return playlists.length > 0 ? (
            <div style={{ marginBottom: 16 }}>
                <div
                    style={{
                        marginBottom: 8,
                        color: '#8c8c8c',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span>
                        {title} ({playlists.length})
                    </span>
                    {playlists.length > INITIAL_VISIBLE_ITEMS && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => setShowAll(!showAll)}
                            style={{ padding: 0 }}
                        >
                            {showAll ? 'Show less' : `Show all (${playlists.length})`}
                        </Button>
                    )}
                </div>
                <List
                    itemLayout="horizontal"
                    dataSource={displayedPlaylists}
                    renderItem={(playlist) => (
                        <List.Item
                            actions={[
                                isAdded ? (
                                    <Button
                                        key="remove"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        loading={isRemoving}
                                        onClick={() => handleRemoveFromPlaylist(playlist.id)}
                                    />
                                ) : (
                                    <Button
                                        key="add"
                                        type="text"
                                        icon={<PlusOutlined />}
                                        style={{
                                            color: '#1890ff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        loading={addingToPlaylist === playlist.id}
                                        onClick={() => handleAddToExistingPlaylist(playlist.id)}
                                    />
                                ),
                            ]}
                            style={{
                                backgroundColor: isAdded ? '#f6ffed' : undefined,
                                borderLeft: isAdded ? '3px solid #52c41a' : undefined,
                                paddingLeft: '16px',
                                margin: '4px 0',
                            }}
                        >
                            <Tooltip title={playlist.description || 'No description'}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <span>{playlist.listName}</span>
                                    {isAdded && (
                                        <span
                                            style={{
                                                fontSize: '12px',
                                                color: '#52c41a',
                                            }}
                                        >
                                            Added
                                        </span>
                                    )}
                                </div>
                            </Tooltip>
                        </List.Item>
                    )}
                />
            </div>
        ) : null;
    };

    return (
        <Modal
            title="Add to Playlist"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {renderPlaylistSection(
                addedPlaylists,
                true,
                showAllAdded,
                setShowAllAdded,
                'Added to playlists'
            )}

            {renderPlaylistSection(
                availablePlaylists,
                false,
                showAllAvailable,
                setShowAllAvailable,
                'Available playlists'
            )}

            <div
                style={{
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: 16,
                }}
            >
                <div
                    style={{
                        marginBottom: 16,
                        color: '#8c8c8c',
                        fontWeight: 500,
                    }}
                >
                    Create new playlist
                </div>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter a playlist name' },
                        ]}
                    >
                        <Input placeholder="Enter playlist name" />
                    </Form.Item>

                    <Form.Item name="description">
                        <Input.TextArea
                            placeholder="Enter playlist description (optional)"
                            rows={2}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            block
                        >
                            Create & Add Movie
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};
