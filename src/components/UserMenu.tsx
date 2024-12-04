import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';

const logout = () => {
  useAuthStore.getState().logout();
};

export const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to="/profile">Edit Profile</Link>,
  },
  {
    key: '2',
    label: <button onClick={logout}>Logout</button>,
  },
];

export const UserMenu: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <Dropdown menu={{ items }} placement="bottom" arrow>
      <Space size={0} align="center" className="text-white">
        <Avatar className="bg-white" size="small" icon={<UserOutlined />} />
        <span className="ml-2">{user?.email}</span>
      </Space>
    </Dropdown>
  );
};
