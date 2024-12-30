import { Button, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../../apis/auth/useResetPassword';

const { Title, Text } = Typography;

export const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, verifyToken, loading } = useResetPassword();
  const [isValidToken, setIsValidToken] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      const isValid = await verifyToken(token);
      if (isValid) {
        setIsValidToken(true);
      }
    };
    checkToken();
  }, [token, navigate, verifyToken]);

  const handleSubmit = async (values: { newPassword: string }) => {
    if (!token) return;

    const success = await resetPassword({
      newPassword: values.newPassword,
      token,
    });
    if (success) {
      navigate('/login');
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
            <Title level={2} className="text-center">
              Invalid Reset Link
            </Title>
            <Text className="text-center block">
              This password reset link is invalid or has expired.
            </Text>
            <div className="text-center">
              <Link to="/forgot-password" className="text-blue-500">
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
          <Title level={2} className="text-center">
            Reset Password
          </Title>
          <Text className="text-center block">
            Please enter your new password.
          </Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password placeholder="Enter new password" size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The two passwords do not match!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Reset Password
              </Button>
            </Form.Item>
            <div className="text-center">
              <Link to="/login" className="text-blue-500">
                Back to Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
