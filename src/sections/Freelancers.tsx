import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, Briefcase, Sparkles, Network, Grid, CheckCircle2 } from 'lucide-react';
import {
  demoFreelancers,
  skillCategories,
  serviceToCategory,
  getAvatarFallback,
  type Freelancer,
} from '../data/freelancers';
import { getAllFreelancers, saveCustomFreelancer } from '../utils/storage';

const servicesList = Object.keys(serviceToCategory);

const categoryColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'WEB DEVELOPMENT': { bg: 'from-cyan-400 to-sky-500', border: 'border-cyan-400/50', text: 'text-cyan-600 dark:text-cyan-400', glow: 'rgba(6, 182, 212, 0.4)' },
  'UI/UX': { bg: 'from-rose-400 to-pink-500', border: 'border-rose-400/50', text: 'text-rose-600 dark:text-rose-400', glow: 'rgba(244, 63, 94, 0.4)' },
  'AI': { bg: 'from-sky-400 to-blue-600', border: 'border-sky-400/50', text: 'text-sky-600 dark:text-sky-400', glow: 'rgba(59, 130, 246, 0.4)' },
  'GRAPHIC DESIGN': { bg: 'from-amber-400 to-orange-500', border: 'border-amber-400/50', text: 'text-amber-600 dark:text-amber-400', glow: 'rgba(245, 158, 11, 0.4)' },
  'VIDEO EDITING': { bg: 'from-teal-400 to-emerald-500', border: 'border-teal-400/50', text: 'text-teal-600 dark:text-teal-400', glow: 'rgba(20, 184, 166, 0.4)' },
  'MOBILE DEVELOPMENT': { bg: 'from-blue-400 to-indigo-500', border: 'border-blue-400/50', text: 'text-blue-600 dark:text-blue-400', glow: 'rgba(56, 189, 248, 0.4)' },
  'CODING': { bg: 'from-indigo-400 to-purple-600', border: 'border-indigo-400/50', text: 'text-indigo-600 dark:text-indigo-400', glow: 'rgba(129, 140, 248, 0.4)' },
  'CONTENT CREATION': { bg: 'from-purple-400 to-pink-500', border: 'border-purple-400/50', text: 'text-purple-600 dark:text-purple-400', glow: 'rgba(168, 85, 247, 0.4)' },
};

// 3D Card Tilt Wrapper Component
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? 'transform 0.5s ease-out' : 'none',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export default function Freelancers() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>(() =>
    getAllFreelancers(demoFreelancers)
  );
  const [viewMode, setViewMode] = useState<'grid' | 'network'>('grid');
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Freelancer | null>(null);
  const [hoveredNetworkNode, setHoveredNetworkNode] = useState<string | null>(null);
  const [hireTarget, setHireTarget] = useState<Freelancer | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Matcher Animation state
  const [matchingService, setMatchingService] = useState<string | null>(null);
  const [matchStep, setMatchStep] = useState<number | null>(null);

  // Profile Form state
  const [form, setForm] = useState({
    name: 'Alex Rivera',
    title: 'Full Stack Web & AI Developer',
    about: 'Passionate student developer building modern web platforms, AI tools, and sleek interfaces.',
    skills: 'React, TypeScript, Python, Node.js, AI APIs',
    technologies: 'React, TypeScript, Python, Tailwind, PostgreSQL',
    projectName: 'AuraFlow AI Platform',
    projectDesc: 'An AI-powered productivity app for student teams.',
    portfolioUrl: 'https://github.com',
    photo: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const refresh = useCallback(() => {
    setFreelancers(getAllFreelancers(demoFreelancers));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#talent-network') {
        setViewMode('network');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const filtered = useMemo(() => {
    let list = freelancers;

    if (skillFilter !== 'ALL') {
      list = list.filter((f) => f.category.includes(skillFilter));
    }

    if (serviceFilter) {
      const cats = serviceToCategory[serviceFilter] || [];
      list = list.filter((f) => f.category.some((c) => cats.includes(c)));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.skills.some((s) => s.toLowerCase().includes(q)) ||
          f.projects.some(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          )
      );
    }

    return list;
  }, [freelancers, search, skillFilter, serviceFilter]);

  const handleServiceSelect = (svc: string) => {
    if (matchingService === svc) {
      setMatchingService(null);
      setServiceFilter(null);
      setMatchStep(null);
      return;
    }

    setMatchingService(svc);
    setServiceFilter(svc);
    setMatchStep(0);

    const matchSequence = ['REQUIREMENT', 'SKILL MATCH', 'TALENT NETWORK', 'AVAILABLE FREELANCERS'];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < matchSequence.length) {
        setMatchStep(idx);
      } else {
        clearInterval(interval);
      }
    }, 350);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setForm((f) => ({ ...f, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.title.trim()) errs.title = 'Professional title is required';
    if (!form.about.trim()) errs.about = 'About is required';
    if (!form.skills.trim()) errs.skills = 'At least one skill is required';
    if (!form.projectName.trim()) errs.projectName = 'Project name is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const technologies = form.technologies
      ? form.technologies.split(',').map((s) => s.trim()).filter(Boolean)
      : skills;

    const newFreelancer: Freelancer = {
      id: `custom-${Date.now()}`,
      name: form.name.trim(),
      title: form.title.trim(),
      about: form.about.trim(),
      avatar: form.photo || getAvatarFallback(form.name.trim()),
      skills,
      technologies,
      projects: [
        {
          id: `proj-${Date.now()}`,
          title: form.projectName.trim(),
          description: form.projectDesc.trim() || 'DEMO STUDENT PROJECT',
          image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          technologies,
        },
      ],
      featuredProject: form.projectName.trim(),
      projectCount: 1,
      category: ['CODING', 'WEB DEVELOPMENT'],
    };

    saveCustomFreelancer(newFreelancer);
    refresh();
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreate(false);
    }, 2500);
  };

  // Preview object for Live Profile Builder
  const livePreviewFreelancer: Freelancer = {
    id: 'preview-live',
    name: form.name.trim() || 'Student Name',
    title: form.title.trim() || 'Professional Title',
    about: form.about.trim() || 'About description will appear here as you type...',
    avatar: form.photo || getAvatarFallback(form.name.trim() || 'Student'),
    skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : ['Skill 1', 'Skill 2'],
    technologies: form.technologies ? form.technologies.split(',').map((s) => s.trim()).filter(Boolean) : ['Tech 1'],
    projects: [
      {
        id: 'p-prev',
        title: form.projectName.trim() || 'Featured Project Name',
        description: form.projectDesc.trim() || 'Project description...',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        technologies: ['React', 'Node'],
      },
    ],
    featuredProject: form.projectName.trim() || 'Featured Project',
    projectCount: 1,
    category: ['WEB DEVELOPMENT'],
  };

  return (
    <section id="freelancers" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400 animate-pulse" />
            <span>STUDENT MARKETPLACE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            FIND THE TALENT <span className="text-prismatic">BEHIND THE SKILL</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Discover student developers, UI/UX designers, AI specialists, and video creators ready to build your next project.
          </p>
        </div>

        {/* "WHAT DO YOU NEED?" Service Matcher */}
        <div className="mb-12 glass-strong rounded-3xl p-6 border border-sky-300/50 dark:border-sky-500/30 shadow-xl">
          <h3 className="mb-4 text-center text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
            WHAT DO YOU NEED HELP WITH?
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {servicesList.map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => handleServiceSelect(svc)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  matchingService === svc
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-lg scale-105'
                    : 'glass-crystal text-slate-700 dark:text-slate-300 hover:border-teal-400/50'
                }`}
              >
                {svc}
              </button>
            ))}
          </div>

          {/* Matcher Sequence Status Bar */}
          {matchStep !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sky-500/10 p-3 text-xs font-extrabold text-sky-600 dark:text-sky-300 border border-sky-500/20"
            >
              <CheckCircle2 size={16} className="text-teal-400" />
              <span>
                MATCHING PIPELINE: <span className="text-emerald-500">STEP {matchStep + 1}</span> → FILTERING CREATORS FOR "{matchingService}"
              </span>
            </motion.div>
          )}
        </div>

        {/* View Toggle & Search + Create */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'glass-crystal text-slate-600 dark:text-slate-300'
              }`}
            >
              <Grid size={16} />
              <span>3D Cards View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('network')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                viewMode === 'network'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'glass-crystal text-slate-600 dark:text-slate-300'
              }`}
            >
              <Network size={16} />
              <span>Talent Network Graph</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search name, skill or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
            >
              <UserPlus size={16} />
              <span>Become Freelancer</span>
            </button>
          </div>
        </div>

        {/* Skill Category Filter Chips */}
        <div className="mb-10 flex flex-wrap gap-2">
          {skillCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSkillFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                skillFilter === cat
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'glass-crystal text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TALENT NETWORK GRAPH VIEW */}
        <div id="talent-network" className="scroll-mt-28" />
        {viewMode === 'network' && (
          <div className="mb-12 glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-sky-300/60 dark:border-sky-500/40 shadow-2xl">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1 text-[11px] font-extrabold uppercase tracking-widest text-sky-700 dark:text-sky-300 mb-2">
                <span>TALENT NETWORK MAP</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">
                STUDENTS <span className="text-sky-600 dark:text-sky-400">→</span> SKILLS <span className="text-sky-600 dark:text-sky-400">→</span> PROJECTS <span className="text-sky-600 dark:text-sky-400">→</span> OPPORTUNITY
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Interactive student marketplace map. Click or hover any creator node to illuminate their skill constellation, verified projects, and career path.
              </p>
            </div>

            {/* Central Hub & Creator Node Map */}
            <div className="relative min-h-[420px] flex flex-col items-center justify-center gap-8 py-4">
              {/* Central Freeverse Ecosystem Node */}
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-600 to-teal-400 text-white shadow-2xl shadow-sky-500/30 border-4 border-white dark:border-slate-900 animate-pulse">
                <div className="text-center">
                  <Sparkles size={20} className="mx-auto" />
                  <span className="text-[9px] font-extrabold uppercase tracking-tighter">FREEVERSE</span>
                </div>
              </div>

              {/* Creator Nodes Grid */}
              <div className="relative z-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((f) => {
                  const primaryCat = f.category[0] || 'WEB DEVELOPMENT';
                  const style = categoryColors[primaryCat] || categoryColors['WEB DEVELOPMENT'];
                  const isHovered = hoveredNetworkNode === f.id;
                  const isDimmed = hoveredNetworkNode !== null && hoveredNetworkNode !== f.id;

                  return (
                    <motion.div
                      key={f.id}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={() => setHoveredNetworkNode(f.id)}
                      onMouseLeave={() => setHoveredNetworkNode(null)}
                      onClick={() => setSelectedProfile(f)}
                      className={`glass-strong cursor-pointer rounded-2xl p-5 border ${style.border} shadow-xl transition-all duration-300 ${
                        isDimmed ? 'opacity-40 scale-98' : 'opacity-100'
                      } ${isHovered ? 'scale-105 shadow-2xl z-20 ring-2 ring-sky-400' : ''}`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={f.avatar}
                          alt={f.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAvatarFallback(f.name);
                          }}
                          className="h-14 w-14 rounded-full border-2 border-sky-400 object-cover shadow-md aspect-square"
                        />
                        <div className="min-w-0 flex-1">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${style.text}`}>
                            {primaryCat}
                          </span>
                          <h4 className="truncate text-base font-extrabold text-slate-950 dark:text-white">{f.name}</h4>
                          <p className="truncate text-xs font-bold text-sky-700 dark:text-sky-300">{f.title}</p>
                        </div>
                      </div>

                      {/* Connected Skills Chips */}
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {f.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                              isHovered
                                ? 'bg-sky-500 text-white border-sky-400'
                                : 'bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-500/20'
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Featured Project & Action */}
                      <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-3 text-xs">
                        <span className="truncate text-slate-700 dark:text-slate-300 font-semibold">
                          Project: <strong className="text-slate-950 dark:text-white">{f.featuredProject}</strong>
                        </span>
                        <span className="shrink-0 text-[10px] font-extrabold uppercase text-sky-700 dark:text-sky-300 hover:underline">
                          View Profile →
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3D GLASS CARDS GRID VIEW */}
        {viewMode === 'grid' && (
          <div>
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800">
                <p className="text-lg font-bold text-slate-800 dark:text-white">No creators found matching criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting filters or search query.</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((f) => {
                    const primaryCat = f.category[0] || 'WEB DEVELOPMENT';
                    const style = categoryColors[primaryCat] || categoryColors['WEB DEVELOPMENT'];

                    return (
                      <TiltCard key={f.id} className="h-full flex flex-col">
                        <motion.article
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`glass-strong h-full flex flex-col justify-between overflow-hidden rounded-3xl border ${style.border} shadow-xl transition-all hover:shadow-2xl`}
                        >
                          <div className="flex items-start gap-4 p-6 border-b border-slate-200/60 dark:border-slate-800/60">
                            <img
                              src={f.avatar}
                              alt={f.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getAvatarFallback(f.name);
                              }}
                              className="h-16 w-16 shrink-0 rounded-full border-2 border-sky-400 object-cover shadow-md aspect-square"
                            />
                            <div className="min-w-0 flex-1">
                              <span className={`text-[10px] font-extrabold tracking-widest uppercase ${style.text}`}>
                                {primaryCat}
                              </span>
                              <h3 className="truncate text-lg font-extrabold text-slate-900 dark:text-white">{f.name}</h3>
                              <p className="truncate text-xs font-bold text-sky-600 dark:text-sky-400">{f.title}</p>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col justify-between p-6">
                            <p className="mb-4 line-clamp-2 text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-200">{f.about}</p>
                            
                            <div className="mb-4 flex flex-wrap gap-1.5">
                              {f.skills.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <Briefcase size={12} className="text-sky-500" />
                              <span>Featured: <strong className="text-slate-900 dark:text-slate-100">{f.featuredProject}</strong></span>
                            </div>
                          </div>

                          <div className="mt-auto flex gap-2 p-4 border-t border-slate-200/60 dark:border-slate-800/60">
                            <button
                              type="button"
                              onClick={() => setSelectedProfile(f)}
                              className="flex-1 rounded-xl border border-sky-300 dark:border-sky-600/50 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-sky-50 dark:hover:bg-slate-800"
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => setHireTarget(f)}
                              className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:opacity-95"
                            >
                              Hire
                            </button>
                          </div>
                        </motion.article>
                      </TiltCard>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Details Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 pt-16 backdrop-blur-md"
            onClick={() => setSelectedProfile(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="glass-strong relative mb-12 w-full max-w-3xl rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900/80"
                aria-label="Close profile"
              >
                <X size={20} />
              </button>

              <div className="p-6 sm:p-8">
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="h-24 w-24 rounded-full border-4 border-sky-400 object-cover shadow-xl"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selectedProfile.name}</h3>
                    <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{selectedProfile.title}</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      {selectedProfile.skills.map((s) => (
                        <span key={s} className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">About Creator</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedProfile.about}</p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">Featured Projects</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedProfile.projects.map((p) => (
                      <div key={p.id} className="glass-panel overflow-hidden rounded-2xl p-4">
                        <img src={p.image} alt={p.title} className="aspect-video w-full rounded-xl object-cover mb-3" />
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{p.title}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfile(null);
                    setHireTarget(selectedProfile);
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl"
                >
                  Hire / Contact {selectedProfile.name}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hire Modal */}
      <AnimatePresence>
        {hireTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={() => setHireTarget(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong w-full max-w-md rounded-3xl p-6 sm:p-8 border border-sky-300/50 dark:border-sky-500/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-2 text-xl font-extrabold text-slate-900 dark:text-white">
                Interested in hiring {hireTarget.name}?
              </h3>
              <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                You're one step closer to working with this creator. Send a demo project brief.
              </p>

              <div className="mb-6 rounded-2xl border border-sky-300/40 dark:border-sky-500/30 bg-sky-500/10 p-4 text-xs">
                <p className="text-slate-800 dark:text-slate-200"><strong>Creator:</strong> {hireTarget.name}</p>
                <p className="text-slate-800 dark:text-slate-200"><strong>Role:</strong> {hireTarget.title}</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setHireTarget(null)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-3 text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setHireTarget(null)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-xs font-extrabold uppercase text-white shadow-md"
                >
                  Send Interest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE FREELANCER PROFILE WITH LIVE PREVIEW MODAL */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 pt-16 backdrop-blur-md"
            onClick={() => !createSuccess && setShowCreate(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="glass-strong relative mb-12 w-full max-w-5xl rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {createSuccess ? (
                <div className="py-16 text-center">
                  <div className="mb-4 text-5xl text-emerald-400">✓</div>
                  <h3 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Your Freeverse profile is ready to be discovered!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">It now appears in the marketplace & talent network.</p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>

                  <div className="mb-6">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                      PROFILE BUILDER WITH LIVE PREVIEW
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Become a Freeverse Freelancer
                    </h3>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-12">
                    {/* LEFT: FORM */}
                    <form onSubmit={handleCreate} className="lg:col-span-7 space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Name *</label>
                        <input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {formErrors.name && <p className="mt-1 text-[11px] text-rose-500">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Profile Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhoto}
                          className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                        />
                        {form.photo && (
                          <img
                            src={form.photo}
                            alt="Uploaded photo preview"
                            className="mt-2 h-12 w-12 rounded-full object-cover border-2 border-sky-400 shadow-md"
                          />
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Professional Title *</label>
                        <input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Full Stack Developer"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {formErrors.title && <p className="mt-1 text-[11px] text-rose-500">{formErrors.title}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">About *</label>
                        <textarea
                          value={form.about}
                          onChange={(e) => setForm({ ...form, about: e.target.value })}
                          rows={3}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {formErrors.about && <p className="mt-1 text-[11px] text-rose-500">{formErrors.about}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Skills * (comma separated)</label>
                        <input
                          value={form.skills}
                          onChange={(e) => setForm({ ...form, skills: e.target.value })}
                          placeholder="React, TypeScript, Node.js"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Featured Project Name *</label>
                        <input
                          value={form.projectName}
                          onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
                      >
                        CREATE FREELANCER PROFILE
                      </button>
                    </form>

                    {/* RIGHT: LIVE CARD PREVIEW */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                      <div className="mb-2 text-center text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        LIVE CARD PREVIEW
                      </div>
                      <TiltCard>
                        <div className="glass-strong flex flex-col overflow-hidden rounded-3xl border border-sky-400/50 shadow-2xl p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <img
                              src={livePreviewFreelancer.avatar}
                              alt="Live Preview"
                              className="h-16 w-16 rounded-full border-2 border-sky-400 object-cover shadow-md"
                            />
                            <div>
                              <span className="text-[10px] font-extrabold text-sky-500 uppercase">WEB DEVELOPMENT</span>
                              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{livePreviewFreelancer.name}</h4>
                              <p className="text-xs font-bold text-sky-600 dark:text-sky-400">{livePreviewFreelancer.title}</p>
                            </div>
                          </div>

                          <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{livePreviewFreelancer.about}</p>

                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {livePreviewFreelancer.skills.map((s) => (
                              <span key={s} className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20">
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="text-xs text-slate-500">
                            Featured: <strong className="text-slate-800 dark:text-slate-200">{livePreviewFreelancer.featuredProject}</strong>
                          </div>
                        </div>
                      </TiltCard>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
