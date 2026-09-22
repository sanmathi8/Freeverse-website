import { Sun, Moon, Sparkles } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ theme, onToggle, className = '' }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'Bright Crystal Aurora' : 'Deep Ocean Crystal'} mode`}
      aria-checked={isDark}
      role="switch"
      className={`group relative inline-flex h-10 items-center rounded-full p-1.5 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
        isDark
          ? 'bg-slate-900/80 border border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
          : 'bg-white/80 border border-slate-200 shadow-md shadow-sky-100'
      } ${className}`}
    >
      {/* Track Background Elements */}
      <span className="flex items-center gap-2 px-1.5 text-xs font-semibold tracking-wider">
        <span
          className={`flex items-center gap-1 transition-opacity duration-300 ${
            !isDark ? 'opacity-100 text-amber-500' : 'opacity-40 text-slate-400'
          }`}
        >
          <Sun size={14} className="animate-spin-slow" />
          <span className="hidden sm:inline">AURORA</span>
        </span>
        <span
          className={`flex items-center gap-1 transition-opacity duration-300 ${
            isDark ? 'opacity-100 text-sky-300' : 'opacity-40 text-slate-400'
          }`}
        >
          <Moon size={14} />
          <span className="hidden sm:inline">OCEAN</span>
        </span>
      </span>

      {/* Sliding Glass Prism Thumb */}
      <span
        className={`absolute top-1 bottom-1 flex aspect-square items-center justify-center rounded-full transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
          isDark
            ? 'translate-x-[calc(100%+1.5rem)] bg-gradient-to-br from-sky-400 to-indigo-600 text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]'
            : 'translate-x-0 bg-gradient-to-br from-amber-300 via-sky-300 to-teal-200 text-slate-800 shadow-md'
        }`}
        style={{ width: '1.75rem', height: '1.75rem' }}
      >
        <Sparkles size={12} className={isDark ? 'text-sky-100 animate-pulse' : 'text-amber-700'} />
      </span>
    </button>
  );
}
