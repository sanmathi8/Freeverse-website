import { fetchApi } from './client';

export interface HireRequestData {
  id: string;
  requesterId: string;
  requesterName: string;
  freelancerId: string;
  freelancerName: string;
  projectTitle: string;
  description: string;
  budget?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export const hireApi = {
  async createHireRequest(freelancerId: string, projectTitle: string, description: string, budget?: string) {
    return fetchApi<HireRequestData>('/hire-requests', {
      method: 'POST',
      body: JSON.stringify({ freelancerId, projectTitle, description, budget }),
    });
  },

  async getSentRequests() {
    return fetchApi<HireRequestData[]>('/hire-requests/sent');
  },

  async getReceivedRequests() {
    return fetchApi<HireRequestData[]>('/hire-requests/received');
  },

  async acceptRequest(id: string) {
    return fetchApi<HireRequestData>(`/hire-requests/${id}/accept`, { method: 'PUT' });
  },

  async declineRequest(id: string) {
    return fetchApi<HireRequestData>(`/hire-requests/${id}/decline`, { method: 'PUT' });
  },

  async completeRequest(id: string) {
    return fetchApi<HireRequestData>(`/hire-requests/${id}/complete`, { method: 'PUT' });
  },

  async cancelRequest(id: string) {
    return fetchApi<HireRequestData>(`/hire-requests/${id}/cancel`, { method: 'PUT' });
  },
};
