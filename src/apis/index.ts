import axios from 'axios';

import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  VITE_URL_API,
  TMDB_URL_API,
  TMDB_ACCESS_TOKEN,
} from '../config';

export interface SearchParam {
  page: number;
  take: number;
  q: string;
  order: 'asc' | 'desc';
  releaseYear: string;
  genre: string;
  rating: number | null;
}

export interface UserFavMovieParam {
  page: number;
  take: number;
}

export interface UserWatchlistParam {
  page: number;
  take: number;
}

/* Auth URL */
export const registerUrl = `${VITE_URL_API}/auth/register`;
export const loginUrl = `${VITE_URL_API}/auth/login`;
export const logoutUrl = `${VITE_URL_API}/auth/logout`;
export const refreshTokenUrl = `${VITE_URL_API}/auth/refresh-token`;

/* User URL */
export const getUserUrl = `${VITE_URL_API}/user/profile`;

/* Movie URL */
export const searchMovieUrl = (searchParam: SearchParam) => {
  const url = new URL(`${VITE_URL_API}/movies/search`);

  // Set the mandatory query parameters
  url.searchParams.set('page', searchParam.page.toString());
  url.searchParams.set('take', searchParam.take.toString());
  url.searchParams.set('q', searchParam.q);
  url.searchParams.set('order', searchParam.order);

  // Conditionally add releaseYear and genre if they are not empty
  if (searchParam.releaseYear) {
    url.searchParams.set('year', searchParam.releaseYear);
  }

  if (searchParam.genre) {
    url.searchParams.set('genre', searchParam.genre);
  }

  if (searchParam.rating) {
    url.searchParams.set('rating', searchParam.rating.toString());
  }

  return url.toString();
};

export const getMovieDetailUrl = (movieId: string) =>
  `${VITE_URL_API}/movies/${movieId}`;
export const getTrendingMovieUrl = (timeWindow: string) =>
  `${VITE_URL_API}/movies/trending/${timeWindow}`;
export const getMovieCardImageUrl = (path: string) =>
  `https://media.themoviedb.org/t/p/w220_and_h330_face/${path}`;
export const getMovieDetailImageUrl = (path: string) =>
  `https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${path}`;
export const noImageUrl = 'https://via.placeholder.com/500x750?text=No+Image';

export const getPeopleDetailUrl = (peopleId: string) =>
  `${VITE_URL_API}/people/${peopleId}`;

export const movieGenresUrl = `${VITE_URL_API}/movies/genres`;

/* User Interaction URL */
export const toggleFavoriteUrl = (movieId: string) =>
  `${VITE_URL_API}/user/fav/${movieId}`;
export const getUserFavMovieUrl = (searchParam: UserFavMovieParam) =>
  `${VITE_URL_API}/user/fav?page=${searchParam.page}&take=${searchParam.take}`;
export const removeUserFavMovieUrl = (movieId: string) =>
  `${VITE_URL_API}/user/fav/${movieId}`;
export const checkUserFavMovieUrl = (movieId: string) =>
  `${VITE_URL_API}/user/fav/check/${movieId}`;
export const getSharedListUrl = (listId: string) =>
  `${VITE_URL_API}/lists/share/${listId}`;

/* User Watchlist URL */
export const toggleWatchlistUrl = (movieId: string) =>
  `${VITE_URL_API}/user/watchlist/${movieId}`;
export const getUserWatchlistUrl = (searchParam: UserFavMovieParam) =>
  `${VITE_URL_API}/user/watchlist?page=${searchParam.page}&take=${searchParam.take}`;
export const removeUserWatchlistUrl = (movieId: string) =>
  `${VITE_URL_API}/user/watchlist/${movieId}`;
export const checkUserWatchlistUrl = (movieId: string) =>
  `${VITE_URL_API}/user/watchlist/check/${movieId}`;

/* My List URL */
export const createPlaylistUrl = () => `${VITE_URL_API}/user/playlists`;
export const addMovieToPlaylistUrl = (playlistId: string) =>
  `${VITE_URL_API}/user/playlists/${playlistId}/movies`;
export const updatePlaylistUrl = (playlistId: string) =>
  `${VITE_URL_API}/user/playlists/${playlistId}`;
export const deletePlaylistUrl = (playlistId: string) =>
  `${VITE_URL_API}/user/playlists/${playlistId}`;
export const removeMovieFromPlaylistUrl = (
  playlistId: string,
  movieId: string
) => `${VITE_URL_API}/user/playlists/${playlistId}/movies/${movieId}`;
export const getPlaylistDetailsUrl = (playlistId: string) =>
  `${VITE_URL_API}/user/playlists/${playlistId}`;
export const getUserPlaylistsUrl = () => `${VITE_URL_API}/user/playlists`;
export const checkMovieInPlaylistsUrl = (movieId: string) =>
  `${VITE_URL_API}/user/playlists/movies/${movieId}/playlists`;

/* Rate Movie URL */
export const rateMovieUrl = (movieId: string) =>
  `${VITE_URL_API}/user/ratings/${movieId}`;
export const getUserRatingsUrl = () => `${VITE_URL_API}/user/ratings`;
export const getUserMovieRatingUrl = (movieId: string) =>
  `${VITE_URL_API}/user/ratings/movie/${movieId}`;
export const updateRatingUrl = (movieId: string) =>
  `${VITE_URL_API}/user/ratings/${movieId}`;
export const deleteRatingUrl = (movieId: string) =>
  `${VITE_URL_API}/user/ratings/${movieId}`;

/* Axios Instance Remote */
export const axiosInstance = axios.create({
  baseURL: VITE_URL_API,
  timeout: 20000,
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
