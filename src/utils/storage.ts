import { defaultOwnerProfile, type Freelancer, type Project } from '../data/freelancers';

const OWNER_PROFILE_KEY = 'freeverse_owner_profile';
const OWNER_PROJECTS_KEY = 'freeverse_owner_projects';
const CUSTOM_FREELANCERS_KEY = 'freeverse_freelancers';

export function loadOwnerProfile(): Freelancer {
  try {
    const rawProfile = localStorage.getItem(OWNER_PROFILE_KEY);
    const rawProjects = localStorage.getItem(OWNER_PROJECTS_KEY);

    let profile: Freelancer = defaultOwnerProfile;

    if (rawProfile) {
      const parsed = JSON.parse(rawProfile) as Freelancer;
      if (parsed && typeof parsed === 'object' && parsed.name) {
        profile = { ...defaultOwnerProfile, ...parsed, isOwner: true };
      }
    }

    if (rawProjects) {
      const parsedProjects = JSON.parse(rawProjects) as Project[];
      if (Array.isArray(parsedProjects)) {
        profile.projects = parsedProjects;
      }
    }

    profile.projectCount = profile.projects.length;
    if (profile.projects.length > 0 && (!profile.featuredProject || !profile.projects.some(p => p.title === profile.featuredProject))) {
      profile.featuredProject = profile.projects[0].title;
    }

    return profile;
  } catch (e) {
    console.warn('Error reading owner profile from localStorage, falling back to default:', e);
    return defaultOwnerProfile;
  }
}

export function saveOwnerProfile(profile: Freelancer): void {
  try {
    const ownerData: Freelancer = {
      ...profile,
      isOwner: true,
      username: profile.username || 'sanmathi',
      projectCount: profile.projects.length,
      featuredProject: profile.projects.length > 0 ? (profile.projects[0].title || profile.featuredProject) : 'None',
    };

    localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(ownerData));
    localStorage.setItem(OWNER_PROJECTS_KEY, JSON.stringify(ownerData.projects));
  } catch (e) {
    console.error('Failed to save owner profile to localStorage:', e);
  }
}

export function addOwnerProject(project: Project): Freelancer {
  const profile = loadOwnerProfile();
  const updatedProjects = [project, ...profile.projects.filter(p => p.id !== project.id)];
  const updatedProfile: Freelancer = {
    ...profile,
    projects: updatedProjects,
    projectCount: updatedProjects.length,
    featuredProject: updatedProjects[0]?.title || profile.featuredProject,
  };
  saveOwnerProfile(updatedProfile);
  return updatedProfile;
}

export function updateOwnerProject(project: Project): Freelancer {
  const profile = loadOwnerProfile();
  const updatedProjects = profile.projects.map(p => (p.id === project.id ? project : p));
  const updatedProfile: Freelancer = {
    ...profile,
    projects: updatedProjects,
  };
  saveOwnerProfile(updatedProfile);
  return updatedProfile;
}

export function deleteOwnerProject(projectId: string): Freelancer {
  const profile = loadOwnerProfile();
  const updatedProjects = profile.projects.filter(p => p.id !== projectId);
  const updatedProfile: Freelancer = {
    ...profile,
    projects: updatedProjects,
    projectCount: updatedProjects.length,
    featuredProject: updatedProjects.length > 0 ? updatedProjects[0].title : '',
  };
  saveOwnerProfile(updatedProfile);
  return updatedProfile;
}

export function loadCustomFreelancers(): Freelancer[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FREELANCERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Freelancer[];
  } catch {
    return [];
  }
}

export function saveCustomFreelancer(freelancer: Freelancer): void {
  try {
    const existing = loadCustomFreelancers();
    const updated = [freelancer, ...existing.filter((f) => f.id !== freelancer.id)];
    localStorage.setItem(CUSTOM_FREELANCERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom freelancer:', e);
  }
}

export function getAllFreelancers(demo: Freelancer[]): Freelancer[] {
  const owner = loadOwnerProfile();
  const custom = loadCustomFreelancers();
  const filteredDemo = demo.filter(f => f.id !== owner.id && f.name.toLowerCase() !== owner.name.toLowerCase());
  return [owner, ...custom, ...filteredDemo];
}

export function compressImage(file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    
    // Check file size (e.g. 10MB max limit before compression)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Image file is too large (max 10MB)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
