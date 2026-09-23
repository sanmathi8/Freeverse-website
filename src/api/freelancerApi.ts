import { fetchApi } from './client';
import type { Freelancer } from '../data/freelancers';

export interface FreelancerFilterParams {
  skill?: string;
  service?: string;
  category?: string;
  availability?: string;
  search?: string;
  page?: number;
  size?: number;
}

export const freelancerApi = {
  async getFreelancers(params: FreelancerFilterParams = {}) {
    const query = new URLSearchParams();
    if (params.skill && params.skill !== 'ALL') query.append('skill', params.skill);
    if (params.service) query.append('service', params.service);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.availability) query.append('availability', params.availability);
    if (params.search) query.append('search', params.search);
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());

    return fetchApi<{ content: Freelancer[]; totalElements: number; totalPages: number }>(
      `/freelancers?${query.toString()}`
    );
  },
};
