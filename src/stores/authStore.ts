import { create } from 'zustand';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config';
import { User } from '../interface/user.interface';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isVerified: boolean;
  user: User | null;
  setUser: (user: User) => void;
  setIsAuthenticated: (value: boolean) => void;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    isVerified?: boolean
  ) => void;
  setIsVerified: (value: boolean) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  accessToken: localStorage.getItem(TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  isVerified: localStorage.getItem('isVerified') === 'true',
  user: null,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  setIsVerified: (value) => {
    localStorage.setItem('isVerified', value.toString());
    set({ isVerified: value });
  },

  setTokens: (accessToken, refreshToken, isVerified = false) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem('isVerified', isVerified.toString());
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isVerified,
    });
  },

  setUser: (user: User) => set({ user }),

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('isVerified');
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isVerified: false,
    });
  },
}));
