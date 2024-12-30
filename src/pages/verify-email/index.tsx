import { Button, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../../apis/auth/useVerifyEmail';
import { useResendVerification } from '../../apis/auth/useResendVerification';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export const VerifyEmail: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { verifyEmail, loading: verifyLoading } = useVerifyEmail();
  const { resendVerification, loading: resendLoading } = useResendVerification();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isVerified = useAuthStore((state) => state.isVerified);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isVerified) {
      navigate('/');
    }
  }, [isAuthenticated, isVerified, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (values: { code: string }) => {
    const success = await verifyEmail({ code: values.code });
    if (success) {
      navigate('/');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    const success = await resendVerification();
    if (success) {
      setCountdown(60); // Start 60 second countdown
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
          <Title level={2} className="text-center">
            Verify Your Email
          </Title>
          <Text className="text-center block">
            Please enter the 6-digit code sent to your email
          </Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleVerify}
            autoComplete="off"
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: 'Please input verification code!' },
                {
                  pattern: /^\d{6}$/,
                  message: 'Please enter a valid 6-digit code!',
                },
              ]}
            >
              <Input
                placeholder="Enter 6-digit code"
                maxLength={6}
                size="large"
                style={{ textAlign: 'center', letterSpacing: '0.5em' }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={verifyLoading}
                block
                size="large"
              >
                Verify Email
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text type="secondary">Didn't receive the code? </Text>
            <Button
              type="link"
              onClick={handleResend}
              loading={resendLoading}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
