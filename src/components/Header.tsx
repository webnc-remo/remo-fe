import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../apis/auth/useLogout';
import { Avatar, Dropdown, Space, Spin } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useGetUserProfile } from '../apis/user/useGetUserProfile'; // Import hook lấy user profile

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, loading: logoutLoading } = useLogout();
  const { getUserProfile } = useGetUserProfile();
  const [email, setEmail] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setEmail(profile.email);
        setAvatar(profile.avatar);
      }
    };

    fetchUserProfile();
  }, [getUserProfile]);

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigate('/login');
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] shadow-md">
      <div className="text-2xl font-bold">Logo</div>
      <div className="flex items-center space-x-4">
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
            {email && <span>{email}</span>}
            <Space>
              {avatar ? (
                <Avatar src={avatar} alt="Avatar" />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </Space>
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
