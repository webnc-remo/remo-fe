import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLogout } from '../apis/auth/useLogout';
import {
  Avatar,
  Dropdown,
  Space,
  Spin,
  Input,
  Button,
  message,
  Switch,
} from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  HeartOutlined,
  BookOutlined,
  UnorderedListOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useGetUserProfile } from '../apis/user/useGetUserProfile';
import { useAuthStore } from '../stores/authStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, loading: logoutLoading } = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isVerified = useAuthStore((state) => state.isVerified);
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState<string>(
    new URLSearchParams(location.search).get('query') ?? ''
  );
  const [isLLMSearch, setIsLLMSearch] = useState<boolean>(
    new URLSearchParams(location.search).get('isLLM') ? true : false
  );

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      message.success('Logged out successfully');
      navigate('/');
    }
  };

  const handleSwitchSearchMode = async () => {
    setIsLLMSearch((prev) => !prev);
  };

  const handleSearch = (value: string) => {
    if (value) {
      const isLLMParam = isLLMSearch ? '&isLLM=true' : '';
      navigate(`/search?query=${encodeURIComponent(value)}` + isLLMParam);
    }
  };

  const renderUserMenu = () => {
    if (!isVerified) {
      return (
        <button className="flex items-center space-x-4">
          <Avatar icon={<UserOutlined />} />
        </button>
      );
    }

    return (
      <Dropdown
        menu={{
          items: [
            {
              key: '1',
              icon: <UserOutlined />,
              label: (
                <span onClick={() => navigate('/profile')}>Edit Profile</span>
              ),
            },
            {
              key: '2',
              icon: <HeartOutlined />,
              label: (
                <span onClick={() => navigate('/favorites')}>
                  Favorite Movies
                </span>
              ),
            },
            {
              key: '3',
              icon: <BookOutlined />,
              label: (
                <span onClick={() => navigate('/watchlist')}>Watchlist</span>
              ),
            },
            {
              key: '4',
              icon: <UnorderedListOutlined />,
              label: <span onClick={() => navigate('/lists')}>My Lists</span>,
            },
            {
              key: '/ratings',
              label: <Link to="/ratings">My Ratings</Link>,
              icon: <StarOutlined />,
            },
            {
              key: '5',
              icon: <LogoutOutlined />,
              label: logoutLoading ? <Spin /> : 'Logout',
              onClick: handleLogout,
            },
          ],
        }}
        trigger={['click']}
      >
        <button
          onClick={(e) => e.preventDefault()}
          className="flex items-center space-x-4"
        >
          {profileLoading ? (
            <Spin size="small" />
          ) : (
            <>
              {profile?.email && (
                <span className="hidden md:block">{profile?.email}</span>
              )}
              <Space>
                {profile?.avatar ? (
                  <Avatar src={profile?.avatar} alt="Avatar" />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )}
              </Space>
            </>
          )}
        </button>
      </Dropdown>
    );
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] shadow-md">
      <div className="responsive-container flex flex-col md:flex-row justify-between items-center p-4">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-center mb-2 md:mb-0"
        >
          ReMo
        </button>

        <div className="flex-grow"></div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Switch
            checked={isLLMSearch}
            onChange={handleSwitchSearchMode}
            className={`${isLLMSearch ? 'bg-blue-500' : 'bg-gray-400'}`}
            checkedChildren="AI"
            unCheckedChildren="Normal"
          />
          <Input.Search
            placeholder={isLLMSearch ? 'Ask anything...' : 'Search...'}
            allowClear
            enterButton
            size="large"
            value={searchValue}
            onSearch={handleSearch}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ maxWidth: '300px', flex: 1 }}
          />
          {isAuthenticated ? (
            renderUserMenu()
          ) : (
            <div className="flex space-x-2">
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                size="large"
              >
                Login
              </Button>
              <Button
                type="dashed"
                onClick={() => navigate('/register')}
                size="large"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
