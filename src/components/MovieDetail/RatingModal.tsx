import React, { useEffect } from 'react';
import { Modal, Form, Input, Slider, Button } from 'antd';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
  initialRating?: number;
  initialReview?: string;
  loading?: boolean;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialReview = '',
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        rating: initialRating,
        review: initialReview,
      });
    }
  }, [form, initialRating, initialReview, isOpen]);

  const handleSubmit = async (values: { rating: number; review: string }) => {
    await onSubmit(values.rating, values.review);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Rate & Review"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          rating: initialRating,
          review: initialReview,
        }}
      >
        <Form.Item
          name="rating"
          label={<span className="font-bold">Rating Score (0-100)</span>}
          rules={[{ required: true, message: 'Please input your rating!' }]}
        >
          <Slider
            min={0}
            max={100}
            marks={{
              0: '0',
              25: '25',
              50: '50',
              75: '75',
              100: '100',
            }}
          />
        </Form.Item>

        <Form.Item
          name="review"
          label={<span className="font-bold">Your Review</span>}
        >
          <Input.TextArea
            rows={4}
            placeholder="Write your review here..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Button onClick={handleCancel} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
