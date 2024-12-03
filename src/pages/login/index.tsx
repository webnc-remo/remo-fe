import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Icons } from '../../components/Icons';
import { getOauthGoogleUrl } from '../../utils/utils';
import { useLogin } from '../../apis/auth/useLogin';

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const { login, loading } = useLogin();

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="content flex items-center justify-center flex-grow bg-main_bg bg-cover bg-center">
        <div>
          <div className="shadow-md flex justify-center p-10 mb:p-8 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-3xl flex-col items-center gap-6 mb:gap-4 w-[604px] mb:w-[300px]">
            <div className="font-bold text-3xl mb:text-2xl">Login</div>
            {error && <div className="text-red-500">{error}</div>}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
              className="w-full flex flex-col items-center"
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div className="w-full flex items-center justify-center">
              <a
                href={getOauthGoogleUrl()}
                className="w-full flex items-center justify-center bg-white rounded-full shadow-md py-4 border-transparent border text-sm font-medium text-neutral-7 transition-all hover:text-tertiary-5 hover:border-tertiary-5 focus:border-transparent focus:text-neutral-7"
              >
                <Icons.GoogleIcon />
                <span className="text-xl mb:text-sm ml-4">
                  Continue with Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
