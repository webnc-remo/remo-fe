import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../apis/auth/useForgotPassword';

const { Title, Text } = Typography;

export const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const { forgotPassword, loading } = useForgotPassword();

    const handleSubmit = async (values: { email: string }) => {
        await forgotPassword(values);
        form.resetFields();
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
                    <div className="text-center space-y-2">
                        <Title level={2} style={{ marginBottom: '8px' }}>
                            Forgot Password?
                        </Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                            No worries, we'll send you reset instructions.
                        </Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email format!' },
                            ]}
                        >
                            <Input
                                placeholder="Enter your email"
                                size="large"
                                style={{ marginBottom: '24px' }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
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
                            <Link
                                to="/login"
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
