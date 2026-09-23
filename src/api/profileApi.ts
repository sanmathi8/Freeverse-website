import { fetchApi } from './client';
import type { Freelancer } from '../data/freelancers';

export const profileApi = {
  async getMyProfile() {
    return fetchApi<Freelancer>('/profiles/me');
  },

  async updateMyProfile(data: Partial<Freelancer> & { initialProject?: any }) {
    return fetchApi<Freelancer>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getPublicProfile(username: string) {
    return fetchApi<Freelancer>(`/profiles/${username}`);
  },

  async deleteMyProfile() {
    return fetchApi<void>('/profiles/me', {
      method: 'DELETE',
    });
  },
};
