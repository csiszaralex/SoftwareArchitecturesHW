import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  initialize: () => void; // Oldalbetöltéskor lefut
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  isAuthenticated: false,

  setToken: (token: string) => {
    // Token mentése sütibe (pl. 7 napra)
    setCookie('auth_token', token, { maxAge: 60 * 60 * 24 * 7 });
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    deleteCookie('auth_token');
    set({ token: null, isAuthenticated: false });
    // Opcionális: átirányítás loginra
    window.location.href = '/';
  },

  initialize: () => {
    const token = getCookie('auth_token');
    if (token) {
      set({ token: token as string, isAuthenticated: true });
    }
  },
}));
