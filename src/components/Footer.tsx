import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-teal-400 text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-prismatic">FREEVERSE</span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNav('#home'); }} className="hover:text-sky-600 dark:hover:text-sky-400">Home</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNav('#about'); }} className="hover:text-sky-600 dark:hover:text-sky-400">About</a>
            <a href="#events" onClick={(e) => { e.preventDefault(); handleNav('#events'); }} className="hover:text-sky-600 dark:hover:text-sky-400">Events</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); handleNav('#projects'); }} className="hover:text-sky-600 dark:hover:text-sky-400">Projects</a>
            <a href="#freelancers" onClick={(e) => { e.preventDefault(); handleNav('#freelancers'); }} className="hover:text-sky-600 dark:hover:text-sky-400">Freelancers</a>
            <a href="#talent-network" onClick={(e) => { e.preventDefault(); handleNav('#talent-network'); }} className="hover:text-sky-600 dark:hover:text-sky-400">Talent Network</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-sky-500">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-sky-500">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-sky-500">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center text-center gap-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <p className="w-full text-center text-slate-800 dark:text-slate-200 font-bold">
            © {new Date().getFullYear()} FREEVERSE Student Digital Ecosystem. All rights reserved.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-1 text-xs font-extrabold text-sky-700 dark:text-sky-300 border border-sky-500/20">
            Built by Freeverse
          </div>
        </div>
      </div>
    </footer>
  );
}
