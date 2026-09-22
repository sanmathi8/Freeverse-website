import type { Freelancer } from '../data/freelancers';

const STORAGE_KEY = 'freeverse_freelancers';

export function loadCustomFreelancers(): Freelancer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Freelancer[];
  } catch {
    return [];
  }
}

export function saveCustomFreelancer(freelancer: Freelancer): void {
  const existing = loadCustomFreelancers();
  const updated = [freelancer, ...existing.filter((f) => f.id !== freelancer.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getAllFreelancers(demo: Freelancer[]): Freelancer[] {
  const custom = loadCustomFreelancers();
  return [...custom, ...demo];
}
