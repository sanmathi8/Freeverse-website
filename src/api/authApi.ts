import { fetchApi, setAuthToken } from './client';

export interface UserAuthData {
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  emailVerified: boolean;
  profile?: any;
}

export const authApi = {
  async register(data: { email: string; username: string; password: string; fullName: string }) {
    const res = await fetchApi<UserAuthData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    return res;
  },

  async login(data: { usernameOrEmail: string; password: string }) {
    const res = await fetchApi<UserAuthData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    return res;
  },

  async verifyEmail(token: string) {
    return fetchApi('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async resendVerificationCode(email: string) {
    return fetchApi('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async forgotPassword(email: string) {
    return fetchApi('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(data: { token: string; newPassword: string }) {
    return fetchApi('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async googleLogin(googleData: { email: string; googleId: string; name?: string; picture?: string }) {
    const res = await fetchApi<UserAuthData>('/auth/oauth2/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
    if (res.success && res.data?.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    return res;
  },

  async getCurrentUser() {
    return fetchApi('/auth/me');
  },

  logout() {
    setAuthToken(null);
  },
};
