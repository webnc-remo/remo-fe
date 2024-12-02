export const SCREEN_SIZE = {
  MOBILE_MIN: 375,
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
};

export const OAUTH_GOOGLE_URL = {
  PROMPT: 'consent',
  ACCESS_TYPE: 'offline',
  RESPONSE_TYPE: 'code',
  ROOT_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  SCOPE: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
};
