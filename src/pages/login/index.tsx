import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { getOauthGoogleUrl } from '../../utils/utils';
import { useLogin } from '../../apis/auth/useLogin';
import { useAuthStore } from '../../stores/authStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { login, loading } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isVerified = useAuthStore((state) => state.isVerified);
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      navigate('/');
    }
  }, [isAuthenticated, isVerified, navigate]);

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    try {
      await login({ email, password });
      navigate(location.state?.from || '/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      navigate('/');
    }
  }, [navigate, setTokens]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Invalid email format!' },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
            </Form.Item>
            <div className="text-center">
              <span>Don't have an account? </span>
              <Link className="text-blue-500" to="/register">
                Register
              </Link>
            </div>
            <Form.Item>
              <div className="text-right">
                <Link to="/forgot-password" className="text-blue-500">
                  Forgot Password?
                </Link>
              </div>
            </Form.Item>
          </Form>
          <div className="w-full flex items-center justify-center">
            <a
              href={getOauthGoogleUrl()}
              className="w-full flex items-center justify-center bg-white rounded-full shadow-md py-4 border-transparent border text-sm font-medium text-neutral-7 transition-all hover:text-tertiary-5 hover:border-tertiary-5 focus:border-transparent focus:text-neutral-7"
            >
              <Icons.GoogleIcon />
              <span className="">Continue with Google</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
