import { fetchApi } from './client';
import type { Project } from '../data/freelancers';

export const projectApi = {
  async getMyProjects() {
    return fetchApi<Project[]>('/projects/me');
  },

  async getProjectById(id: string) {
    return fetchApi<Project>(`/projects/${id}`);
  },

  async createProject(project: Partial<Project>) {
    return fetchApi<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updateProject(id: string, project: Partial<Project>) {
    return fetchApi<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id: string) {
    return fetchApi(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
