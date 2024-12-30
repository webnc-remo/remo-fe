import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../apis/auth/useForgotPassword';

const { Title, Text } = Typography;

export const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const { forgotPassword, loading } = useForgotPassword();

    const handleSubmit = async (values: { email: string }) => {
        const success = await forgotPassword(values);
        if (success) {
            form.resetFields();
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
                    <Title level={2} className="text-center">
                        Forgot Password
                    </Title>
                    <Text className="text-center block">
                        Enter your email address and we'll send you instructions to reset your password.
                    </Text>
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
                            <Input placeholder="Enter your email" size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                Send Reset Instructions
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
