import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';


interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: User) => {
    setCookie('auth_token', token, { maxAge: 60 * 60 * 24 * 7 });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }

    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    deleteCookie('auth_token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
    
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = getCookie('auth_token');
    
    let user: User | null = null;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (e) {
          console.error("Hiba a user parse-olásakor", e);
        }
      }
    }

    if (token && user) {
      set({ token: token as string, user, isAuthenticated: true });
    } else {
       set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));