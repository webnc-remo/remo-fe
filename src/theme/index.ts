import { ThemeConfig } from 'antd';

import { colors } from './colors';

const theme: ThemeConfig = {
  token: {
    // Mobile
    screenXS: 767,
    screenXSMin: 767,
    screenXSMax: 767,
    screenSM: 767,
    screenSMMin: 767,
    screenSMMax: 767,

    // Tablet
    screenMD: 768,
    screenMDMin: 768,
    screenMDMax: 1278,
    screenLGMin: 1279,
    screenLG: 1279,
    screenLGMax: 1279,

    // Desktop
    screenXL: 1280,
    screenXLMin: 1280,
    screenXLMax: 1599,
    screenXXL: 1600,
    screenXXLMin: 1600,

    //fontFamily
    fontFamily: 'Gilroy',

    // text color
    colorText: colors.neutral[10],
    colorTextDescription: colors.neutral[7],
    colorTextDisabled: colors.neutral[5],
    colorBorder: colors.neutral[4],
    colorSplit: colors.neutral[3],
    colorPrimary: colors.secondary[5],
    colorPrimaryHover: colors.primary[5],
    colorPrimaryActive: colors.secondary[5],
    colorTextLightSolid: colors.neutral[10],
    colorBgContainerDisabled: colors.neutral[3],

    // Using for Tooltip
    paddingSM: 20,
    paddingXS: 20,
    colorBgSpotlight: colors.neutral[1],
    boxShadowSecondary: `2px 4px 8px 0px rgba(0, 13, 11, 0.1)`,
  },
  components: {
    Dropdown: {
      paddingXXS: 0,
      controlItemBgActive: colors.tertiary[1],
      controlItemBgHover: colors.tertiary[1],
      controlItemBgActiveHover: colors.tertiary[1],
      colorBgTextHover: colors.tertiary[1],
      paddingBlock: 16,
      controlPaddingHorizontal: 20,
      marginXS: 16,
      colorPrimaryActive: '#ccc',
    },
    Menu: {
      itemSelectedBg: colors.tertiary[1],
      itemSelectedColor: colors.tertiary[5],
      itemBorderRadius: 0,
      itemMarginBlock: 0,
      itemMarginInline: 0,
      itemColor: colors.neutral[10],
      controlHeightLG: 72,
      itemHoverBg: colors.tertiary[1],
      itemHoverColor: colors.tertiary[5],
      activeBarBorderWidth: 0,
    },
    Button: {
      fontWeight: 500,
      primaryColor: colors.neutral[10],
      defaultHoverColor: colors.tertiary[5],
      defaultBg: colors.neutral[2],
      defaultBorderColor: 'transparent',
      defaultHoverBg: colors.neutral[2],
      defaultHoverBorderColor: colors.tertiary[5],
      defaultActiveBg: colors.neutral[2],
      defaultActiveBorderColor: 'transparent',
      defaultActiveColor: colors.neutral[10],
      lineWidth: 1,
      primaryShadow: 'transparent',
      defaultShadow: 'transparent',
    },
    Card: {
      borderRadiusLG: 12,
    },

    Input: {
      borderRadius: 12,
      paddingBlock: 9,
      paddingInline: 16,
    },
    Breadcrumb: {
      itemColor: colors.neutral[7],
      lastItemColor: colors.neutral[10],
      separatorColor: colors.neutral[7],
    },
    Collapse: {
      headerBg: 'white',
    },
  },
};

export default theme;
