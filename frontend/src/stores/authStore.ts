import { create } from 'zustand';
import type { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateToken: (token: string) => void;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    // 设置默认余额避免 NaN 闪烁（login/register API 不返回 balance 字段）
    const safeUser = { ...{ balance: 0, bonus_balance: 0 }, ...user };
    set({ token, user: safeUser, isAuthenticated: true });
    // 立即获取完整用户数据（含 balance/bonus_balance）
    _get().fetchMe();
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (partial: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    }));
  },

  updateToken: (token: string) => {
    localStorage.setItem('auth_token', token);
    set({ token });
  },

  fetchMe: async () => {
    try {
      const res = await authApi.getMe();
      if (res.code !== 0) {
        throw new Error(res.message || 'Failed to fetch user info');
      }
      set({ user: res.data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('auth_token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      set({ token });
      try {
        const res = await authApi.getMe();
        if (res.code !== 0) {
          throw new Error(res.message || 'Failed to fetch user info');
        }
        set({ user: res.data, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
