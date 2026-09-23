import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  UserPlus,
  Briefcase,
  Sparkles,
  Network,
  Grid,
  CheckCircle2,
  Edit3,
  Trash2,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  AlertCircle,
  Check,
  UserCheck,
} from 'lucide-react';
import {
  demoFreelancers,
  skillCategories,
  serviceToCategory,
  getAvatarFallback,
  type Freelancer,
  type Project,
} from '../data/freelancers';
import {
  getAllFreelancers,
  loadOwnerProfile,
  saveOwnerProfile,
  addOwnerProject,
  updateOwnerProject,
  deleteOwnerProject,
  saveCustomFreelancer,
  compressImage,
} from '../utils/storage';

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

  // ================= PROFILE EDITING STATE =================
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    title: '',
    bio: '',
    about: '',
    avatar: '',
    skills: '',
    category: [] as string[],
    education: '',
    services: [] as string[],
    github: '',
    linkedin: '',
    portfolio: '',
    availability: 'Available for Hire',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // ================= PROJECT MANAGEMENT STATE =================
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'WEB DEVELOPMENT',
    description: '',
    image: '',
    technologies: '',
    projectLink: '',
    githubLink: '',
    completionYear: new Date().getFullYear().toString(),
  });
  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({});
  const [imageCompressing, setImageCompressing] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // ================= NEW FREELANCER BUILDER FORM STATE =================
  const [createForm, setCreateForm] = useState({
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@example.com',
    photo: '',
    title: 'Full Stack Web & AI Developer',
    about: 'Passionate student developer building modern web platforms, AI tools, and sleek interfaces.',
    skills: 'React, TypeScript, Python, Node.js, AI APIs',
    college: 'Kangeyam Institute of Technology',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2028',
    services: ['WEB DEVELOPMENT', 'CODING'] as string[],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    portfolio: 'https://alexrivera.dev',
    projectName: 'AuraFlow AI Platform',
    projectDesc: 'An AI-powered productivity app for student teams.',
    projectCategory: 'WEB DEVELOPMENT',
    projectTechnologies: 'React, TypeScript, Python, Tailwind, PostgreSQL',
    projectImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    projectLink: 'https://auraflow.dev',
    projectGithubLink: 'https://github.com/alexrivera/auraflow',
    projectCompletionYear: '2024',
  });
  const [createFormErrors, setCreateFormErrors] = useState<Record<string, string>>({});

  const refresh = useCallback(() => {
    const list = getAllFreelancers(demoFreelancers);
    setFreelancers(list);
    // If selected profile is currently open, keep it synced with newest data
    if (selectedProfile) {
      const updated = list.find((f) => f.id === selectedProfile.id || (selectedProfile.isOwner && f.isOwner));
      if (updated) {
        setSelectedProfile(updated);
      }
    }
  }, [selectedProfile]);

  useEffect(() => {
    refresh();
  }, []);

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
          (f.username && f.username.toLowerCase().includes(q)) ||
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

  const ownerProfile = useMemo(() => {
    return freelancers.find((f) => f.isOwner || f.id === 'sanmathi-owner') || loadOwnerProfile();
  }, [freelancers]);

  // ================= OPEN EDIT PROFILE MODAL =================
  const handleOpenEditProfile = () => {
    const current = loadOwnerProfile();
    setProfileForm({
      name: current.name || 'Sanmathi',
      username: current.username || 'sanmathi',
      title: current.title || 'Full Stack & AI Developer',
      bio: current.bio || 'Passionate student developer building modern web applications.',
      about: current.about || '',
      avatar: current.avatar || '',
      skills: current.skills ? current.skills.join(', ') : '',
      category: current.category || ['WEB DEVELOPMENT'],
      education: current.education || 'B.Tech Computer Science',
      services: current.services || ['BUILD A WEBSITE', 'CODING'],
      github: current.github || '',
      linkedin: current.linkedin || '',
      portfolio: current.portfolio || '',
      availability: current.availability || 'Available for Hire',
    });
    setProfileErrors({});
    setShowEditProfileModal(true);
  };

  // Profile photo upload handler with compression
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageCompressing(true);
        const compressed = await compressImage(file, 400, 400, 0.85);
        setProfileForm((prev) => ({ ...prev, avatar: compressed }));
      } catch (err) {
        console.error('Photo compression error:', err);
      } finally {
        setImageCompressing(false);
      }
    }
  };

  // Validate Profile Form
  const validateProfileForm = () => {
    const errs: Record<string, string> = {};
    if (!profileForm.name.trim()) errs.name = 'Full name is required';
    if (!profileForm.title.trim()) errs.title = 'Professional title is required';
    if (!profileForm.about.trim()) errs.about = 'About details are required';
    if (!profileForm.skills.trim()) errs.skills = 'At least one skill is required';
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    const currentOwner = loadOwnerProfile();
    const parsedSkills = profileForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProfile: Freelancer = {
      ...currentOwner,
      name: profileForm.name.trim(),
      username: profileForm.username.trim().replace(/^@/, '') || 'sanmathi',
      title: profileForm.title.trim(),
      bio: profileForm.bio.trim(),
      about: profileForm.about.trim(),
      avatar: profileForm.avatar.trim() || getAvatarFallback(profileForm.name.trim()),
      skills: parsedSkills,
      technologies: parsedSkills,
      category: profileForm.category.length > 0 ? profileForm.category : ['WEB DEVELOPMENT'],
      education: profileForm.education.trim(),
      services: profileForm.services,
      github: profileForm.github.trim(),
      linkedin: profileForm.linkedin.trim(),
      portfolio: profileForm.portfolio.trim(),
      availability: profileForm.availability,
      isOwner: true,
    };

    saveOwnerProfile(updatedProfile);
    refresh();
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setShowEditProfileModal(false);
    }, 1200);
  };

  // Toggle category selection in profile form
  const toggleProfileCategory = (cat: string) => {
    if (cat === 'ALL') return;
    setProfileForm((prev) => {
      const exists = prev.category.includes(cat);
      const updated = exists ? prev.category.filter((c) => c !== cat) : [...prev.category, cat];
      return { ...prev, category: updated.length ? updated : ['WEB DEVELOPMENT'] };
    });
  };

  // Toggle service selection in profile form
  const toggleProfileService = (svc: string) => {
    setProfileForm((prev) => {
      const exists = prev.services.includes(svc);
      const updated = exists ? prev.services.filter((s) => s !== svc) : [...prev.services, svc];
      return { ...prev, services: updated };
    });
  };

  // Live profile preview calculation
  const livePreviewOwner: Freelancer = useMemo(() => {
    const currentOwner = loadOwnerProfile();
    const parsedSkills = profileForm.skills
      ? profileForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Skill 1', 'Skill 2'];

    return {
      ...currentOwner,
      name: profileForm.name.trim() || 'Sanmathi',
      username: profileForm.username.trim() || 'sanmathi',
      title: profileForm.title.trim() || 'Professional Title',
      bio: profileForm.bio.trim() || 'Short bio preview...',
      about: profileForm.about.trim() || 'About description preview will appear here...',
      avatar: profileForm.avatar.trim() || getAvatarFallback(profileForm.name.trim() || 'Sanmathi'),
      skills: parsedSkills,
      category: profileForm.category.length > 0 ? profileForm.category : ['WEB DEVELOPMENT'],
      availability: profileForm.availability,
      education: profileForm.education,
    };
  }, [profileForm]);

  // ================= OPEN ADD / EDIT PROJECT MODAL =================
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'WEB DEVELOPMENT',
      description: '',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      technologies: 'React, TypeScript, Tailwind CSS',
      projectLink: '',
      githubLink: '',
      completionYear: new Date().getFullYear().toString(),
    });
    setProjectErrors({});
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'WEB DEVELOPMENT',
      description: proj.description || '',
      image: proj.image || '',
      technologies: proj.technologies ? proj.technologies.join(', ') : '',
      projectLink: proj.projectLink || '',
      githubLink: proj.githubLink || '',
      completionYear: proj.completionYear || new Date().getFullYear().toString(),
    });
    setProjectErrors({});
    setShowProjectModal(true);
  };

  // Project image upload with compression
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageCompressing(true);
        const compressed = await compressImage(file, 800, 600, 0.8);
        setProjectForm((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error('Project image compression error:', err);
      } finally {
        setImageCompressing(false);
      }
    }
  };

  // Validate Project Form
  const validateProjectForm = () => {
    const errs: Record<string, string> = {};
    if (!projectForm.title.trim()) errs.title = 'Project title is required';
    if (!projectForm.category.trim()) errs.category = 'Category is required';
    if (!projectForm.description.trim()) errs.description = 'Project description is required';
    if (!projectForm.image.trim()) errs.image = 'Project image is required';
    if (!projectForm.technologies.trim()) errs.technologies = 'Technologies used are required';
    setProjectErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Project (Add or Edit)
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProjectForm()) return;

    const parsedTechs = projectForm.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectData: Project = {
      id: editingProject ? editingProject.id : `owner-proj-${Date.now()}`,
      title: projectForm.title.trim(),
      category: projectForm.category,
      description: projectForm.description.trim(),
      image: projectForm.image.trim(),
      technologies: parsedTechs,
      projectLink: projectForm.projectLink.trim(),
      githubLink: projectForm.githubLink.trim(),
      completionYear: projectForm.completionYear.trim(),
    };

    if (editingProject) {
      updateOwnerProject(projectData);
    } else {
      addOwnerProject(projectData);
    }

    refresh();
    setShowProjectModal(false);
  };

  // Confirm Delete Project
  const handleConfirmDeleteProject = () => {
    if (!deletingProject) return;
    deleteOwnerProject(deletingProject.id);
    refresh();
    setDeletingProject(null);
  };

  // Matcher service button click
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

  // Create Freelancer Form Image & Service Handlers
  const handleCreatePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageCompressing(true);
        const compressed = await compressImage(file, 400, 400, 0.85);
        setCreateForm((prev) => ({ ...prev, photo: compressed }));
      } catch (err) {
        console.error('Photo compression error:', err);
      } finally {
        setImageCompressing(false);
      }
    }
  };

  const handleCreateProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageCompressing(true);
        const compressed = await compressImage(file, 800, 600, 0.8);
        setCreateForm((prev) => ({ ...prev, projectImage: compressed }));
      } catch (err) {
        console.error('Project image compression error:', err);
      } finally {
        setImageCompressing(false);
      }
    }
  };

  const toggleCreateService = (svc: string) => {
    setCreateForm((prev) => {
      const exists = prev.services.includes(svc);
      const updated = exists ? prev.services.filter((s) => s !== svc) : [...prev.services, svc];
      return { ...prev, services: updated };
    });
  };

  // Create New Freelancer Form Handler
  const handleCreateNewFreelancer = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!createForm.name.trim()) errs.name = 'Full Name is required';
    if (!createForm.username.trim()) {
      errs.username = 'Username is required';
    }
    if (!createForm.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!createForm.title.trim()) errs.title = 'Professional title is required';
    if (!createForm.about.trim()) errs.about = 'About details are required';
    if (!createForm.skills.trim()) errs.skills = 'At least one skill is required';

    if (!createForm.projectName.trim()) errs.projectName = 'Project name is required';
    if (!createForm.projectDesc.trim()) errs.projectDesc = 'Project description is required';
    if (!createForm.projectCategory.trim()) errs.projectCategory = 'Project category is required';
    if (!createForm.projectTechnologies.trim()) errs.projectTechnologies = 'Technologies used are required';
    if (!createForm.projectImage.trim()) errs.projectImage = 'Project image is required';

    setCreateFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const skills = createForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const projectTechs = createForm.projectTechnologies.split(',').map((s) => s.trim()).filter(Boolean);

    // Format education string
    let educationFormatted = '';
    if (createForm.degree.trim() || createForm.college.trim()) {
      const parts = [];
      if (createForm.degree.trim()) parts.push(createForm.degree.trim());
      if (createForm.college.trim()) parts.push(createForm.college.trim());
      if (createForm.gradYear.trim()) parts.push(createForm.gradYear.trim());
      educationFormatted = parts.join(', ');
    }

    // Map categories
    const derivedCategories = new Set<string>();
    derivedCategories.add(createForm.projectCategory.toUpperCase());
    createForm.services.forEach((svc) => {
      const cats = serviceToCategory[svc];
      if (cats) cats.forEach((c) => derivedCategories.add(c));
    });

    const newFreelancer: Freelancer = {
      id: `custom-${Date.now()}`,
      name: createForm.name.trim(),
      username: createForm.username.trim().replace(/^@/, ''),
      email: createForm.email.trim(),
      title: createForm.title.trim(),
      about: createForm.about.trim(),
      avatar: createForm.photo || getAvatarFallback(createForm.name.trim()),
      skills,
      technologies: skills,
      education: educationFormatted || undefined,
      services: createForm.services.length > 0 ? createForm.services : undefined,
      github: createForm.github.trim() || undefined,
      linkedin: createForm.linkedin.trim() || undefined,
      portfolio: createForm.portfolio.trim() || undefined,
      projects: [
        {
          id: `proj-${Date.now()}`,
          title: createForm.projectName.trim(),
          description: createForm.projectDesc.trim(),
          image: createForm.projectImage.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          category: createForm.projectCategory,
          technologies: projectTechs,
          projectLink: createForm.projectLink.trim() || undefined,
          githubLink: createForm.projectGithubLink.trim() || undefined,
          completionYear: createForm.projectCompletionYear.trim() || new Date().getFullYear().toString(),
        },
      ],
      featuredProject: createForm.projectName.trim(),
      projectCount: 1,
      category: Array.from(derivedCategories),
    };

    saveCustomFreelancer(newFreelancer);
    refresh();
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreate(false);
    }, 2000);
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

        {/* View Toggle & Search + Owner Action Bar */}
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search name, skill or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* OWNER PROFILE SHORTCUT CTA */}
            <button
              type="button"
              onClick={() => setSelectedProfile(ownerProfile)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-sky-400 bg-sky-500/10 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-300 shadow-md hover:bg-sky-500/20 transition-all"
            >
              <UserCheck size={16} className="text-sky-400" />
              <span>My Profile ({ownerProfile.name})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
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
                Interactive student marketplace map. Click or hover any creator node to illuminate their skill constellation and portfolio.
              </p>
            </div>

            <div className="relative min-h-[420px] flex flex-col items-center justify-center gap-8 py-4">
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-600 to-teal-400 text-white shadow-2xl shadow-sky-500/30 border-4 border-white dark:border-slate-900 animate-pulse">
                <div className="text-center">
                  <Sparkles size={20} className="mx-auto" />
                  <span className="text-[9px] font-extrabold uppercase tracking-tighter">FREEVERSE</span>
                </div>
              </div>

              <div className="relative z-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((f) => {
                  const primaryCat = f.category[0] || 'WEB DEVELOPMENT';
                  const style = categoryColors[primaryCat] || categoryColors['WEB DEVELOPMENT'];
                  const isHovered = hoveredNetworkNode === f.id;
                  const isDimmed = hoveredNetworkNode !== null && hoveredNetworkNode !== f.id;
                  const isOwnerNode = f.isOwner || f.id === 'sanmathi-owner';

                  return (
                    <motion.div
                      key={f.id}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={() => setHoveredNetworkNode(f.id)}
                      onMouseLeave={() => setHoveredNetworkNode(null)}
                      onClick={() => setSelectedProfile(f)}
                      className={`glass-strong cursor-pointer rounded-2xl p-5 border ${style.border} shadow-xl transition-all duration-300 ${
                        isDimmed ? 'opacity-40 scale-98' : 'opacity-100'
                      } ${isHovered ? 'scale-105 shadow-2xl z-20 ring-2 ring-sky-400' : ''} ${
                        isOwnerNode ? 'ring-2 ring-sky-400/80 bg-sky-500/5' : ''
                      }`}
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
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${style.text}`}>
                              {primaryCat}
                            </span>
                            {isOwnerNode && (
                              <span className="rounded bg-sky-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                                OWNER
                              </span>
                            )}
                          </div>
                          <h4 className="truncate text-base font-extrabold text-slate-950 dark:text-white">
                            {f.name} {f.username ? <span className="text-xs text-sky-500 font-normal">@{f.username}</span> : ''}
                          </h4>
                          <p className="truncate text-xs font-bold text-sky-700 dark:text-sky-300">{f.title}</p>
                        </div>
                      </div>

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

                      <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-3 text-xs">
                        <span className="truncate text-slate-700 dark:text-slate-300 font-semibold">
                          Featured: <strong className="text-slate-950 dark:text-white">{f.featuredProject || 'Projects available'}</strong>
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
                    const isOwnerCard = f.isOwner || f.id === 'sanmathi-owner';

                    return (
                      <TiltCard key={f.id} className="h-full flex flex-col">
                        <motion.article
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`glass-strong h-full flex flex-col justify-between overflow-hidden rounded-3xl border ${style.border} shadow-xl transition-all hover:shadow-2xl ${
                            isOwnerCard ? 'ring-2 ring-sky-400/80 shadow-sky-500/20' : ''
                          }`}
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
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-extrabold tracking-widest uppercase ${style.text}`}>
                                  {primaryCat}
                                </span>
                                {isOwnerCard && (
                                  <span className="rounded bg-sky-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <h3 className="truncate text-lg font-extrabold text-slate-900 dark:text-white">
                                {f.name}
                              </h3>
                              {f.username && (
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">@{f.username}</p>
                              )}
                              <p className="truncate text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5">{f.title}</p>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col justify-between p-6">
                            <p className="mb-4 line-clamp-2 text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-200">
                              {f.bio || f.about}
                            </p>
                            
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
                              <span className="truncate">
                                Portfolio: <strong className="text-slate-900 dark:text-slate-100">{f.projects?.length || 0} Projects</strong>
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto flex gap-2 p-4 border-t border-slate-200/60 dark:border-slate-800/60">
                            <button
                              type="button"
                              onClick={() => setSelectedProfile(f)}
                              className="flex-1 rounded-xl border border-sky-300 dark:border-sky-600/50 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              View Profile
                            </button>
                            {isOwnerCard ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProfile(f);
                                  handleOpenEditProfile();
                                }}
                                className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:opacity-95 flex items-center justify-center gap-1.5"
                              >
                                <Edit3 size={14} />
                                <span>Edit Profile</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setHireTarget(f)}
                                className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:opacity-95"
                              >
                                Hire
                              </button>
                            )}
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

      {/* ================= FREELANCER PROFILE MODAL (VIEW / OWNER MODE) ================= */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 pt-12 sm:pt-16 backdrop-blur-md"
            onClick={() => setSelectedProfile(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="glass-strong relative mb-12 w-full max-w-4xl rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Banner */}
              <div className="h-28 bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 relative">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900/80 transition-colors"
                  aria-label="Close profile"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 pb-8 sm:px-10 -mt-14 relative z-10">
                {/* Avatar & Title Bar */}
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-end justify-between">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                    <img
                      src={selectedProfile.avatar}
                      alt={selectedProfile.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAvatarFallback(selectedProfile.name);
                      }}
                      className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-2xl aspect-square bg-slate-800"
                    />
                    <div className="text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          {selectedProfile.name}
                        </h3>
                        {selectedProfile.username && (
                          <span className="text-sm font-semibold text-sky-500">@{selectedProfile.username}</span>
                        )}
                        {(selectedProfile.isOwner || selectedProfile.id === 'sanmathi-owner') && (
                          <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-sky-600 dark:text-sky-300 border border-sky-400/40">
                            LOCAL OWNER PROFILE
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{selectedProfile.title}</p>
                      
                      {selectedProfile.availability && (
                        <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          {selectedProfile.availability}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* OWNER ACTION BUTTONS */}
                  {(selectedProfile.isOwner || selectedProfile.id === 'sanmathi-owner') && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                      <button
                        type="button"
                        onClick={handleOpenEditProfile}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-transform"
                      >
                        <Edit3 size={15} />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenAddProject}
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-transform"
                      >
                        <Plus size={16} />
                        <span>Add Project</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Metadata Info Bar */}
                <div className="mb-6 flex flex-wrap gap-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800/80 text-xs">
                  {selectedProfile.education && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <GraduationCap size={16} className="text-sky-500" />
                      <span>{selectedProfile.education}</span>
                    </div>
                  )}
                  {selectedProfile.github && (
                    <a
                      href={selectedProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-sky-500 font-semibold"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {selectedProfile.linkedin && (
                    <a
                      href={selectedProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-sky-500 font-semibold"
                    >
                      <Linkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {selectedProfile.portfolio && (
                    <a
                      href={selectedProfile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-sky-500 font-semibold"
                    >
                      <Globe size={14} />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>

                {/* Bio / About */}
                <div className="mb-6">
                  <h4 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                    About Creator
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    {selectedProfile.about || selectedProfile.bio}
                  </p>
                </div>

                {/* Skills & Services */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div>
                    <h4 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.skills.map((s) => (
                        <span key={s} className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProfile.services && selectedProfile.services.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                        Services Offered
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProfile.services.map((svc) => (
                          <span key={svc} className="rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 border border-teal-500/20">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= PROJECTS / PORTFOLIO SECTION ================= */}
                <div className="mb-8 border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>PROJECTS / PORTFOLIO</span>
                        <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs text-sky-600 dark:text-sky-400 font-bold">
                          {selectedProfile.projects ? selectedProfile.projects.length : 0}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Completed student projects and work showcase.
                      </p>
                    </div>

                    {(selectedProfile.isOwner || selectedProfile.id === 'sanmathi-owner') && (
                      <button
                        type="button"
                        onClick={handleOpenAddProject}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-3.5 py-2 text-xs font-extrabold uppercase text-white shadow-md hover:scale-105 transition-transform"
                      >
                        <Plus size={15} />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>

                  {/* Empty Project State */}
                  {(!selectedProfile.projects || selectedProfile.projects.length === 0) ? (
                    <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
                      <Briefcase size={36} className="mx-auto text-slate-400 mb-3" />
                      <h5 className="text-base font-extrabold text-slate-800 dark:text-slate-200">No projects added yet.</h5>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Showcase your work by adding your first project to your portfolio.
                      </p>
                      {(selectedProfile.isOwner || selectedProfile.id === 'sanmathi-owner') && (
                        <button
                          type="button"
                          onClick={handleOpenAddProject}
                          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
                        >
                          <Plus size={16} />
                          <span>Add Project</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {selectedProfile.projects.map((p) => (
                        <div
                          key={p.id}
                          className="glass-panel overflow-hidden rounded-2xl border border-sky-300/40 dark:border-sky-500/30 p-4 flex flex-col justify-between shadow-lg relative group"
                        >
                          <div>
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-3 bg-slate-900">
                              <img
                                src={p.image}
                                alt={p.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop';
                                }}
                                className="h-full w-full object-cover"
                              />
                              {p.category && (
                                <span className="absolute left-2.5 top-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider text-white backdrop-blur-md border border-white/20">
                                  {p.category}
                                </span>
                              )}
                              {p.completionYear && (
                                <span className="absolute right-2.5 top-2.5 rounded-full bg-sky-500/80 px-2 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-md">
                                  {p.completionYear}
                                </span>
                              )}
                            </div>

                            <h5 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">
                              {p.title}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed line-clamp-3">
                              {p.description}
                            </p>

                            <div className="mb-4 flex flex-wrap gap-1">
                              {p.technologies?.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {p.projectLink && (
                                <a
                                  href={p.projectLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-600 dark:text-sky-400 hover:underline"
                                >
                                  <span>View Project</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                              {p.githubLink && (
                                <a
                                  href={p.githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 hover:underline"
                                >
                                  <Github size={12} />
                                  <span>GitHub</span>
                                </a>
                              )}
                            </div>

                            {/* OWNER PROJECT ACTIONS */}
                            {(selectedProfile.isOwner || selectedProfile.id === 'sanmathi-owner') && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProject(p)}
                                  className="rounded-lg bg-sky-500/10 p-1.5 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingProject(p)}
                                  className="rounded-lg bg-rose-500/10 p-1.5 text-rose-500 hover:bg-rose-500/20 transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Public Hire CTA (for non-owner profiles) */}
                {!(selectedProfile.isOwner || selectedProfile.id === 'sanmathi-owner') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProfile(null);
                      setHireTarget(selectedProfile);
                    }}
                    className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl hover:opacity-95"
                  >
                    Hire / Contact {selectedProfile.name}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= EDIT PROFILE MODAL WITH LIVE PREVIEW ================= */}
      <AnimatePresence>
        {showEditProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 pt-12 sm:pt-16 backdrop-blur-md"
            onClick={() => setShowEditProfileModal(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong relative mb-12 w-full max-w-5xl rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  EDIT FREELANCER PROFILE
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Update Sanmathi's Freelancer Profile
                </h3>
              </div>

              {profileSaveSuccess && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-500/20 p-4 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Check size={18} />
                  <span>Profile updated successfully! Changes saved to browser storage.</span>
                </div>
              )}

              <div className="grid gap-8 lg:grid-cols-12">
                {/* FORM COLUMN */}
                <form onSubmit={handleSaveProfile} className="lg:col-span-7 space-y-4">
                  {/* Photo Upload & Preview */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={profileForm.avatar || getAvatarFallback(profileForm.name || 'S')}
                        alt="Avatar preview"
                        className="h-14 w-14 rounded-full object-cover border-2 border-sky-400 shadow-md aspect-square bg-slate-900"
                      />
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white cursor-pointer"
                        />
                        {imageCompressing && <p className="mt-1 text-[11px] text-sky-400">Compressing image...</p>}
                      </div>
                    </div>
                  </div>

                  {/* Name & Username */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      />
                      {profileErrors.name && <p className="mt-1 text-[11px] text-rose-500">{profileErrors.name}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">@</span>
                        <input
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-7 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title & Availability */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Professional Title *
                      </label>
                      <input
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        placeholder="Full Stack & AI Developer"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      />
                      {profileErrors.title && <p className="mt-1 text-[11px] text-rose-500">{profileErrors.title}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Availability Status
                      </label>
                      <select
                        value={profileForm.availability}
                        onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      >
                        <option value="Available for Hire">Available for Hire</option>
                        <option value="Busy">Busy with projects</option>
                        <option value="Unavailable">Not available right now</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Short Tagline / Bio
                    </label>
                    <input
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Passionate student developer building modern web apps..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  {/* Detailed About */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Detailed About *
                    </label>
                    <textarea
                      value={profileForm.about}
                      onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                    {profileErrors.about && <p className="mt-1 text-[11px] text-rose-500">{profileErrors.about}</p>}
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Skills * (comma separated)
                    </label>
                    <input
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      placeholder="React, TypeScript, Python, Node.js, AI"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                    {profileErrors.skills && <p className="mt-1 text-[11px] text-rose-500">{profileErrors.skills}</p>}
                  </div>

                  {/* Skill Categories */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Skill Categories
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {skillCategories.filter((cat) => cat !== 'ALL').map((cat) => {
                        const isSelected = profileForm.category.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleProfileCategory(cat)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                              isSelected
                                ? 'bg-sky-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-sky-500'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Services Offered */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Services Offered
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {servicesList.map((svc) => {
                        const isSelected = profileForm.services.includes(svc);
                        return (
                          <button
                            key={svc}
                            type="button"
                            onClick={() => toggleProfileService(svc)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                              isSelected
                                ? 'bg-teal-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500'
                            }`}
                          >
                            {svc}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Education & Links */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Education
                      </label>
                      <input
                        value={profileForm.education}
                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                        placeholder="B.Tech Computer Science, 2025"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        GitHub Profile Link
                      </label>
                      <input
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        placeholder="https://github.com/sanmathi8"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        LinkedIn Profile Link
                      </label>
                      <input
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/sanmathi"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Portfolio Website Link
                      </label>
                      <input
                        value={profileForm.portfolio}
                        onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })}
                        placeholder="https://freeverse.dev"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditProfileModal(false)}
                      className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 py-3 text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                {/* LIVE PREVIEW COLUMN */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="mb-3 text-center text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                    LIVE PROFILE PREVIEW
                  </div>

                  <TiltCard>
                    <div className="glass-strong flex flex-col overflow-hidden rounded-3xl border border-sky-400/50 shadow-2xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={livePreviewOwner.avatar}
                          alt="Live Preview"
                          className="h-16 w-16 rounded-full border-2 border-sky-400 object-cover shadow-md aspect-square bg-slate-900"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-extrabold text-sky-500 uppercase">
                            {livePreviewOwner.category[0] || 'WEB DEVELOPMENT'}
                          </span>
                          <h4 className="text-lg font-extrabold text-slate-900 dark:text-white truncate">
                            {livePreviewOwner.name}
                          </h4>
                          {livePreviewOwner.username && (
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              @{livePreviewOwner.username}
                            </p>
                          )}
                          <p className="text-xs font-bold text-sky-600 dark:text-sky-400 truncate">
                            {livePreviewOwner.title}
                          </p>
                        </div>
                      </div>

                      <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3 font-medium">
                        {livePreviewOwner.bio || livePreviewOwner.about}
                      </p>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {livePreviewOwner.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto border-t border-slate-200/60 dark:border-slate-800/60 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{livePreviewOwner.availability}</span>
                        <span className="font-bold text-sky-500">
                          {livePreviewOwner.projects?.length || 0} Portfolio Items
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ADD / EDIT PROJECT MODAL ================= */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 pt-12 sm:pt-16 backdrop-blur-md"
            onClick={() => setShowProjectModal(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong relative mb-12 w-full max-w-xl rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  PORTFOLIO MANAGEMENT
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add New Completed Project'}
                </h3>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                {/* Title & Category */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Project Title *
                    </label>
                    <input
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="CampusConnect App"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                    {projectErrors.title && <p className="mt-1 text-[11px] text-rose-500">{projectErrors.title}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Project Category *
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    >
                      {skillCategories.filter((c) => c !== 'ALL').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {projectErrors.category && <p className="mt-1 text-[11px] text-rose-500">{projectErrors.category}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Project Description *
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={3}
                    placeholder="Describe what you built, key features, and your role..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                  {projectErrors.description && <p className="mt-1 text-[11px] text-rose-500">{projectErrors.description}</p>}
                </div>

                {/* Image Upload / URL */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Project Image / Thumbnail *
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProjectImageUpload}
                        className="flex-1 text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white cursor-pointer"
                      />
                      {imageCompressing && <p className="text-[11px] text-sky-400">Processing...</p>}
                    </div>

                    <input
                      type="url"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="Or enter image URL (https://...)"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />

                    {projectForm.image && (
                      <div className="relative aspect-video w-36 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 mt-1">
                        <img src={projectForm.image} alt="Thumbnail preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  {projectErrors.image && <p className="mt-1 text-[11px] text-rose-500">{projectErrors.image}</p>}
                </div>

                {/* Technologies */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Technologies / Skills Used * (comma separated)
                  </label>
                  <input
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, Node.js, Socket.io, MongoDB"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                  {projectErrors.technologies && <p className="mt-1 text-[11px] text-rose-500">{projectErrors.technologies}</p>}
                </div>

                {/* Links & Year (Optional) */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Live Project Link (Optional)
                    </label>
                    <input
                      value={projectForm.projectLink}
                      onChange={(e) => setProjectForm({ ...projectForm, projectLink: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      GitHub Link (Optional)
                    </label>
                    <input
                      value={projectForm.githubLink}
                      onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Completion Year (Optional)
                    </label>
                    <input
                      value={projectForm.completionYear}
                      onChange={(e) => setProjectForm({ ...projectForm, completionYear: e.target.value })}
                      placeholder="2024"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit & Cancel */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 py-3 text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
                  >
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DELETE PROJECT CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {deletingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={() => setDeletingProject(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong w-full max-w-md rounded-3xl p-6 sm:p-8 border border-rose-500/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertCircle size={24} />
              </div>

              <h3 className="mb-2 text-xl font-extrabold text-slate-900 dark:text-white">
                Delete this project?
              </h3>
              <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{deletingProject.title}"</strong> from your portfolio? This project will be removed from your profile.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingProject(null)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-3 text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteProject}
                  className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-rose-700 transition-colors"
                >
                  Delete
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
              <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                Send a project brief to connect with this creator.
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

      {/* Legacy Create Freelancer Profile Modal */}
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
              className="glass-strong relative mb-12 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {createSuccess ? (
                <div className="py-16 text-center">
                  <div className="mb-4 text-5xl text-emerald-400">✓</div>
                  <h3 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Your Freeverse profile is ready!
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
                      CREATE NEW FREELANCER
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Join Freeverse Student Marketplace
                    </h3>
                  </div>

                  <form onSubmit={handleCreateNewFreelancer} className="space-y-6">
                    {/* SECTION 1: PERSONAL DETAILS */}
                    <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        1. Personal Details
                      </h4>

                      {/* Profile Photo */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Profile Photo
                        </label>
                        <div className="flex items-center gap-4">
                          <img
                            src={createForm.photo || getAvatarFallback(createForm.name || 'F')}
                            alt="Profile preview"
                            className="h-16 w-16 rounded-full object-cover border-2 border-sky-400 shadow-md aspect-square bg-slate-900"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-sm inline-flex items-center gap-1.5">
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCreatePhotoUpload}
                                  className="hidden"
                                />
                              </label>
                              {createForm.photo && (
                                <button
                                  type="button"
                                  onClick={() => setCreateForm((prev) => ({ ...prev, photo: '' }))}
                                  className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-colors"
                                >
                                  Remove Photo
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">Frontend-only file upload. Compressed before storage.</p>
                          </div>
                        </div>
                      </div>

                      {/* Name, Username, Email */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Name *</label>
                          <input
                            value={createForm.name}
                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            placeholder="e.g. Sanmathi"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                          {createFormErrors.name && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.name}</p>}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Username *</label>
                          <input
                            value={createForm.username}
                            onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                            placeholder="e.g. @sanmathi"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                          {createFormErrors.username && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.username}</p>}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                          <input
                            type="email"
                            value={createForm.email}
                            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                            placeholder="e.g. sanmathi@example.com"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                          {createFormErrors.email && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.email}</p>}
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PROFESSIONAL DETAILS */}
                    <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        2. Professional Details
                      </h4>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Professional Title *</label>
                        <input
                          value={createForm.title}
                          onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                          placeholder="e.g. Full Stack & AI Developer"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {createFormErrors.title && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.title}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">About *</label>
                        <textarea
                          value={createForm.about}
                          onChange={(e) => setCreateForm({ ...createForm, about: e.target.value })}
                          rows={3}
                          placeholder="Describe your background and expertise..."
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {createFormErrors.about && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.about}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Skills * (comma separated)</label>
                        <input
                          value={createForm.skills}
                          onChange={(e) => setCreateForm({ ...createForm, skills: e.target.value })}
                          placeholder="React, TypeScript, Node.js, Python"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {createFormErrors.skills && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.skills}</p>}
                      </div>
                    </div>

                    {/* SECTION 3: EDUCATION */}
                    <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        3. Education
                      </h4>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">College / Institution</label>
                          <input
                            value={createForm.college}
                            onChange={(e) => setCreateForm({ ...createForm, college: e.target.value })}
                            placeholder="e.g. Kangeyam Institute of Technology"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Degree / Course</label>
                          <input
                            value={createForm.degree}
                            onChange={(e) => setCreateForm({ ...createForm, degree: e.target.value })}
                            placeholder="e.g. B.E. Computer Science and Engineering"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Graduation Year</label>
                          <input
                            value={createForm.gradYear}
                            onChange={(e) => setCreateForm({ ...createForm, gradYear: e.target.value })}
                            placeholder="e.g. 2028"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: SERVICES & LINKS */}
                    <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        4. Services Offered & Portfolio Links
                      </h4>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">Services Offered</label>
                        <div className="flex flex-wrap gap-2">
                          {servicesList.map((svc) => {
                            const isSelected = createForm.services.includes(svc);
                            return (
                              <button
                                key={svc}
                                type="button"
                                onClick={() => toggleCreateService(svc)}
                                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-sky-500 text-white shadow-md'
                                    : 'glass-crystal text-slate-600 dark:text-slate-400 hover:border-sky-400/40'
                                }`}
                              >
                                {svc}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">GitHub URL</label>
                          <input
                            value={createForm.github}
                            onChange={(e) => setCreateForm({ ...createForm, github: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn URL</label>
                          <input
                            value={createForm.linkedin}
                            onChange={(e) => setCreateForm({ ...createForm, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Portfolio Website</label>
                          <input
                            value={createForm.portfolio}
                            onChange={(e) => setCreateForm({ ...createForm, portfolio: e.target.value })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: INITIAL PROJECT */}
                    <div className="pb-2 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        5. Initial Project Showcase
                      </h4>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Initial Project Name *</label>
                          <input
                            value={createForm.projectName}
                            onChange={(e) => setCreateForm({ ...createForm, projectName: e.target.value })}
                            placeholder="e.g. AuraFlow AI Platform"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                          {createFormErrors.projectName && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.projectName}</p>}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Project Category *</label>
                          <select
                            value={createForm.projectCategory}
                            onChange={(e) => setCreateForm({ ...createForm, projectCategory: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          >
                            {skillCategories.filter(c => c !== 'ALL').map(cat => (
                              <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                            ))}
                          </select>
                          {createFormErrors.projectCategory && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.projectCategory}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Project Description *</label>
                        <textarea
                          value={createForm.projectDesc}
                          onChange={(e) => setCreateForm({ ...createForm, projectDesc: e.target.value })}
                          rows={2}
                          placeholder="Brief description of your project..."
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {createFormErrors.projectDesc && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.projectDesc}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Technologies Used * (comma separated)</label>
                        <input
                          value={createForm.projectTechnologies}
                          onChange={(e) => setCreateForm({ ...createForm, projectTechnologies: e.target.value })}
                          placeholder="React, TypeScript, Tailwind, Node.js"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                        />
                        {createFormErrors.projectTechnologies && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.projectTechnologies}</p>}
                      </div>

                      {/* Project Image Upload */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Project Image / Thumbnail *</label>
                        <div className="flex items-center gap-4">
                          {createForm.projectImage ? (
                            <img
                              src={createForm.projectImage}
                              alt="Project thumbnail"
                              className="h-20 w-32 rounded-xl object-cover border-2 border-sky-400 shadow-md bg-slate-900"
                            />
                          ) : (
                            <div className="h-20 w-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-semibold text-center p-2">
                              No Image Uploaded
                            </div>
                          )}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-sm inline-flex items-center gap-1.5">
                                <span>Upload Project Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCreateProjectImageUpload}
                                  className="hidden"
                                />
                              </label>
                              {createForm.projectImage && (
                                <button
                                  type="button"
                                  onClick={() => setCreateForm((prev) => ({ ...prev, projectImage: '' }))}
                                  className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-colors"
                                >
                                  Remove Image
                                </button>
                              )}
                            </div>
                            {createFormErrors.projectImage && <p className="mt-1 text-[11px] text-rose-500">{createFormErrors.projectImage}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Optional Project Links */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Live Project Link (Optional)</label>
                          <input
                            value={createForm.projectLink}
                            onChange={(e) => setCreateForm({ ...createForm, projectLink: e.target.value })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">GitHub Link (Optional)</label>
                          <input
                            value={createForm.projectGithubLink}
                            onChange={(e) => setCreateForm({ ...createForm, projectGithubLink: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Completion Year (Optional)</label>
                          <input
                            value={createForm.projectCompletionYear}
                            onChange={(e) => setCreateForm({ ...createForm, projectCompletionYear: e.target.value })}
                            placeholder="2024"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.01]"
                    >
                      CREATE FREELANCER PROFILE
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
