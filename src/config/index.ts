const publicRuntimeConfig = {
  VITE_URL_API: import.meta.env.VITE_URL_API,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_OAUTH_CLIENT_ID: import.meta.env.VITE_OAUTH_CLIENT_ID,
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI: import.meta.env
    .VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',
  VITE_WEB_URL: import.meta.env.VITE_WEB_URL,
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  TMDB_ACCESS_TOKEN: import.meta.env.VITE_TMDB_ACCESS_TOKEN,
  TMDB_URL_API: import.meta.env.TMDB_URL_API,
};

export const {
  VITE_URL_API,
  VITE_GOOGLE_CLIENT_ID,
  VITE_OAUTH_CLIENT_ID,
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  VITE_WEB_URL,
  USER_KEY,
  TMDB_API_KEY,
  TMDB_ACCESS_TOKEN,
  TMDB_URL_API,
} = publicRuntimeConfig;
export default publicRuntimeConfig;
