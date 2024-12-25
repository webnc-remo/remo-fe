import { Modal, Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  addMovieToPlaylistUrl,
  axiosInstance,
  createPlaylistUrl,
} from '../../apis';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
}

export const CreatePlaylistModal = ({
  isOpen,
  onClose,
  movieId,
}: CreatePlaylistModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    if (!movieId) return;

    setIsSubmitting(true);
    try {
      // Create new playlist
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

      // Invalidate playlists query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['playlists', 'movie', movieId],
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

  return (
    <Modal
      title="Add to Playlist"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Playlist Name"
          rules={[{ required: true, message: 'Please enter a playlist name' }]}
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
          <Button type="primary" htmlType="submit" loading={isSubmitting} block>
            Create & Add Movie
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
