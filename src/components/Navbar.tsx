import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Projects', href: '#projects' },
  { label: 'Freelancers', href: '#freelancers' },
  { label: 'Talent Network', href: '#talent-network' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong py-3 shadow-xl backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('#home');
          }}
          className="group flex items-center gap-2 text-xl font-extrabold tracking-tight text-prismatic sm:text-2xl"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-400 p-1.5 text-white shadow-md shadow-sky-500/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <Sparkles size={18} />
          </div>
          <span className="font-extrabold tracking-wider">FREEVERSE</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNav(link.href);
              }}
              className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="#join"
            onClick={(e) => {
              e.preventDefault();
              handleNav('#join');
            }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">JOIN FREEVERSE</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="rounded-xl p-2.5 text-slate-200 hover:bg-slate-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="glass-strong absolute inset-x-0 top-full border-b border-slate-200/80 dark:border-slate-800/80 lg:hidden shadow-2xl">
          <nav className="flex flex-col gap-1 px-5 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="rounded-xl px-4 py-3 text-sm font-bold tracking-wide text-slate-800 hover:bg-sky-50 hover:text-sky-600 dark:text-slate-100 dark:hover:bg-slate-800/60 dark:hover:text-sky-400"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#join"
              onClick={(e) => {
                e.preventDefault();
                handleNav('#join');
              }}
              className="mt-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
            >
              JOIN FREEVERSE
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
