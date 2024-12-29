import { Button, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../../apis/auth/useVerifyEmail';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export const VerifyEmail: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { verifyEmail, loading } = useVerifyEmail();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isVerified = useAuthStore((state) => state.isVerified);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (isVerified) {
            navigate('/');
        }
    }, [isAuthenticated, isVerified, navigate]);

    const handleVerify = async (values: { code: string }) => {
        const success = await verifyEmail({ code: values.code });
        if (success) {
            navigate('/');
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
                                loading={loading}
                                block
                                size="large"
                            >
                                Verify Email
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}; 
