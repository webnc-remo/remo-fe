import { create } from 'zustand';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isVerified: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    isVerified?: boolean
  ) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  accessToken: localStorage.getItem(TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  isVerified: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  setTokens: (accessToken, refreshToken, isVerified = false) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isVerified,
    });
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isVerified: false,
    });
  },
}));
