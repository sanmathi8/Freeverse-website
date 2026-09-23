import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, LogOut, Settings, MessageSquare, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SettingsModal } from './SettingsModal';
import { MessagingModal } from './MessagingModal';
import { HireModal } from './HireModal';

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
  const { user, profile, isAuthenticated, openAuthModal, logout } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);

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
    <>
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
          <div className="hidden items-center gap-3 lg:flex">
            {/* Direct Messaging Launcher */}
            <button
              type="button"
              onClick={() => setShowMessaging(true)}
              className="relative rounded-full border border-sky-400/40 bg-sky-500/10 p-2 text-sky-400 hover:bg-sky-500/20 transition-colors"
              title="Messages"
            >
              <MessageSquare size={16} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
                1
              </span>
            </button>

            {/* Hire Proposals Launcher */}
            <button
              type="button"
              onClick={() => setShowHireModal(true)}
              className="rounded-full border border-sky-400/40 bg-sky-500/10 p-2 text-sky-400 hover:bg-sky-500/20 transition-colors"
              title="Hire Proposals"
            >
              <Briefcase size={16} />
            </button>

            {/* Settings Launcher */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="rounded-full border border-slate-700 bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings size={16} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 backdrop-blur-md">
                  <img
                    src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80'}
                    alt={profile?.name || user?.username}
                    className="h-6 w-6 rounded-full object-cover border border-sky-400 aspect-square"
                  />
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    @{user?.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-rose-500/40 bg-rose-500/10 p-2 text-rose-500 hover:bg-rose-500/20 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400 transition-colors px-3 py-2"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">JOIN FREEVERSE</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </>
            )}
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
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowMessaging(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-sky-400"
                >
                  <MessageSquare size={16} />
                  <span>Messages</span>
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowSettings(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="mt-4 rounded-full border border-rose-500/40 bg-rose-500/10 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-rose-500 shadow-md"
                >
                  SIGN OUT (@{user?.username})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('register');
                  }}
                  className="mt-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
                >
                  JOIN FREEVERSE
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Interactive Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <MessagingModal isOpen={showMessaging} onClose={() => setShowMessaging(false)} />
      <HireModal isOpen={showHireModal} onClose={() => setShowHireModal(false)} />
    </>
  );
}
