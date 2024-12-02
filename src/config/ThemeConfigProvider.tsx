import { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';

import theme from '../theme';

export const ThemeConfigProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
