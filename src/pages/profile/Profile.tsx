import React from 'react';
import { Card, Avatar, Spin, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useGetUserProfile } from '../../apis/user/useGetUserProfile';

export const Profile: React.FC = () => {
  const { profile, loading } = useGetUserProfile();

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: 'block', margin: 'auto', marginTop: '20%' }}
      />
    );
  }

  return (
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
          style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}
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
        <Button type="primary" block style={{ marginTop: '16px' }}>
          Edit Profile
        </Button>
      </Card>
    </div>
  );
};
