import { Header as AntdHeader } from 'antd/es/layout/layout';
import { UserMenu } from './UserMenu';

export const Header: React.FC = () => {
  return (
    <AntdHeader className="flex items-center justify-end">
      <UserMenu />
    </AntdHeader>
  );
};
