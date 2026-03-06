import { post, put } from './client';
import type { User, ChangePasswordRequest } from '@/types';

export const userApi = {
  updateProfile: (data: { nickname: string }) =>
    put<User>('/user/profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return post<{ avatar_url: string }>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePassword: (data: ChangePasswordRequest) =>
    put<{ token: string }>('/user/password', data),

  bindGoogle: (idToken: string) =>
    post<{ google_email: string }>('/user/google/bind', { id_token: idToken }),

  unbindGoogle: () =>
    post<null>('/user/google/unbind', {}),
};
