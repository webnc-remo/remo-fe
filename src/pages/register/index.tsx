import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../../apis/auth/useRegister';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, loading } = useRegister();

  const onFinish = async (values: RegisterForm) => {
    const { email, password } = values;
    const success = await register({ email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="shadow-md flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center">Register</h1>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
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
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
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
        </div>
      </div>
    </div>
  );
};
