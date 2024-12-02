const publicRuntimeConfig = {
  VITE_URL_API: import.meta.env.VITE_URL_API,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_OAUTH_CLIENT_ID: import.meta.env.VITE_OAUTH_CLIENT_ID,
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI: import.meta.env
    .VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refreshToken',
  VITE_WEB_URL: import.meta.env.VITE_WEB_URL,
};

export const {
  VITE_URL_API,
  VITE_GOOGLE_CLIENT_ID,
  VITE_OAUTH_CLIENT_ID,
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  VITE_WEB_URL,
} = publicRuntimeConfig;
export default publicRuntimeConfig;
