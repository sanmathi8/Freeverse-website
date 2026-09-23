import { fetchApi } from './client';
import type { Freelancer } from '../data/freelancers';

export const savedFreelancerApi = {
  async getSavedFreelancers() {
    return fetchApi<Freelancer[]>('/saved-freelancers');
  },

  async saveFreelancer(profileId: string) {
    return fetchApi(`/saved-freelancers/${profileId}`, { method: 'POST' });
  },

  async unsaveFreelancer(profileId: string) {
    return fetchApi(`/saved-freelancers/${profileId}`, { method: 'DELETE' });
  },
};
