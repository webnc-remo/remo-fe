import React, { useState } from 'react';
import { Card, Avatar, Spin, Form, Input, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useGetUserProfile } from '../../apis/user/useGetUserProfile';
import { useUpdateProfile } from '../../apis/user/useUpdateProfile';

export const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const { data: profile, isLoading } = useGetUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEdit = () => {
    form.setFieldsValue({
      fullName: profile?.fullName || '',
    });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: { fullName: string }) => {
    await updateProfileMutation.mutateAsync(values);
    setIsEditModalVisible(false);
  };

  if (isLoading) {
    return (
      <Spin
        size="large"
        style={{ display: 'block', margin: 'auto', marginTop: '20%' }}
      />
    );
  }

  return (
    <>
      <div
        title="User Profile"
        style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}
      >
        <Card
          style={{
            width: 400,
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            User Profile
          </div>

          <Avatar
            size={100}
            src={profile?.avatar}
            icon={<UserOutlined />}
            style={{ marginBottom: '16px', marginTop: '16px' }}
          />
          <Form layout="vertical">
            <Form.Item label="Full Name" style={{ marginBottom: '8px' }}>
              <Input
                value={profile?.fullName ?? 'Not set'}
                disabled
                style={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#000',
                  backgroundColor: '#f0f0f0',
                }}
              />
            </Form.Item>
            <Form.Item label="Email" style={{ marginBottom: '8px' }}>
              <Input
                value={profile?.email ?? 'N/A'}
                disabled
                style={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#000',
                  backgroundColor: '#f0f0f0',
                }}
              />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            block
            onClick={handleEdit}
            style={{ marginTop: '16px' }}
          >
            Edit Profile
          </Button>
        </Card>
      </div>

      <Modal
        title="Edit Profile"
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: 'Please input your full name!' },
              { min: 2, message: 'Full name must be at least 2 characters!' },
              { max: 50, message: 'Full name cannot exceed 50 characters!' },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
              }}
            >
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateProfileMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
