import { Button, Form, Input } from 'antd';
import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { getOauthGoogleUrl } from '../../utils/utils';
import { useRegister } from '../../apis/auth/useRegister';
import { useAuthStore } from '../../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const { register, loading } = useRegister();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (values: {
    email: string;
    password: string;
  }) => {
    const { email, password } = values;
    try {
      await register({ email, password });
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center">Register</h1>
          {error && <div className="text-red-500">{error}</div>}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
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
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The two passwords do not match!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Register
              </Button>
            </Form.Item>
            <div className="text-center">
              <span>Already have an account? </span>
              <Link className="text-blue-500" to="/login">
                Login
              </Link>
            </div>
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
