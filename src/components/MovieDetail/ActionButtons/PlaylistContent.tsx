import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { usePlaylistsByMovie } from '../../../apis/lists/usePlaylistsByMovie';
import { useRemoveFromPlaylist } from '../../../apis/user/useRemoveFromPlaylist';

interface PlaylistContentProps {
    movieId: string;
}

export const PlaylistContent = ({ movieId }: PlaylistContentProps) => {
    const { data: moviePlaylists, refetch: refetchPlaylists } = usePlaylistsByMovie(movieId);
    const { removeFromPlaylist, isLoading: isRemoving } = useRemoveFromPlaylist();

    return (
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
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromPlaylist({ playlistId: playlist.id, movieId }, {
                                    onSuccess: () => refetchPlaylists()
                                });
                            }}
                            loading={isRemoving}
                        />
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
}; 
