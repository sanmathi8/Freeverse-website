import { fetchApi } from './client';

export interface UploadResult {
  url: string;
  filename: string;
}

export const uploadApi = {
  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<UploadResult>('/uploads/profile-image', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadProjectImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<UploadResult>('/uploads/project-image', {
      method: 'POST',
      body: formData,
    });
  },
};
