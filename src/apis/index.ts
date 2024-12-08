import axios from 'axios';

import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  VITE_URL_API,
  TMDB_URL_API,
  TMDB_ACCESS_TOKEN,
} from '../config';

/* Auth URL */
export const registerUrl = `${VITE_URL_API}/auth/register`;
export const loginUrl = `${VITE_URL_API}/auth/login`;
export const logoutUrl = `${VITE_URL_API}/auth/logout`;
export const refreshTokenUrl = `${VITE_URL_API}/auth/refresh-token`;

/* User URL */
export const getUserUrl = `${VITE_URL_API}/user/profile`;

/* Movie URL */
export const searchMovieUrl = `${TMDB_URL_API}/search/movie`;
export const getMovieDetailUrl = (movieId: string) =>
  `${TMDB_URL_API}/movie/${movieId}`;
export const getTrendingMovieUrl = (timeWindow: string) =>
  `${TMDB_URL_API}/trending/movie/${timeWindow}`;
export const getMovieCardImageUrl = (path: string) =>
  `https://media.themoviedb.org/t/p/w220_and_h330_face/${path}`;
export const getMovieDetailImageUrl = (path: string) =>
  `https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${path}`;
export const noImageUrl = 'https://via.placeholder.com/500x750?text=No+Image';

/* Axios Instance Remo */
export const axiosInstance = axios.create({
  baseURL: VITE_URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      new Error(error.message || 'An unknown error occurred')
    );
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${VITE_URL_API}/v1/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(
      new Error(error.message || 'An unknown error occurred')
    );
  }
);

export const axiosInstanceTMDB = axios.create({
  baseURL: TMDB_URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Axios Instance TMDB */

axiosInstanceTMDB.interceptors.request.use(
  (config) => {
    const tmdbAccessToken = TMDB_ACCESS_TOKEN;
    if (tmdbAccessToken) {
      config.headers.Authorization = `Bearer ${tmdbAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      new Error(error.message || 'An unknown error occurred')
    );
  }
);

axiosInstanceTMDB.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      new Error(error.message || 'An unknown error occurred')
    );
  }
);
