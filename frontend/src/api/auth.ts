import { post, get } from './client';
import type { AuthResponse, RegisterRequest, User } from '@/types';

/** Ensure phone number has +91 prefix for backend validation */
const withCountryCode = (phone: string) =>
  phone.startsWith('+91') ? phone : `+91${phone}`;

export const authApi = {
  sendOTP: (phone: string, purpose: string) =>
    post<{ expires_in: number }>('/auth/send-otp', { phone: withCountryCode(phone), purpose }),

  register: (data: RegisterRequest) =>
    post<AuthResponse>('/auth/register', { ...data, phone: withCountryCode(data.phone) }),

  login: (phone: string, password: string) =>
    post<AuthResponse>('/auth/login', { phone: withCountryCode(phone), password }),

  loginOTP: (phone: string, otp: string) =>
    post<AuthResponse>('/auth/login-otp', { phone: withCountryCode(phone), otp }),

  googleLogin: (idToken: string) =>
    post<AuthResponse>('/auth/google', { id_token: idToken }),

  getMe: () =>
    get<User>('/auth/me'),

  logout: () =>
    post<null>('/auth/logout', {}),
};
