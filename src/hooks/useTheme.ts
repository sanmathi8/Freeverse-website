import { useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const theme: Theme = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  }, []);

  return { theme, setTheme: () => {}, toggleTheme: () => {} };
}
