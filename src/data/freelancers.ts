export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category?: string;
  projectLink?: string;
  githubLink?: string;
  completionYear?: string;
}

export interface Freelancer {
  id: string;
  name: string;
  username?: string;
  email?: string;
  title: string;
  about: string;
  bio?: string;
  avatar: string;
  skills: string[];
  technologies: string[];
  projects: Project[];
  featuredProject: string;
  projectCount: number;
  category: string[];
  education?: string;
  services?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  availability?: string;
  isOwner?: boolean;
}

export const defaultOwnerProfile: Freelancer = {
  id: 'sanmathi-owner',
  name: 'Sanmathi',
  username: 'sanmathi',
  title: 'Full Stack & AI Developer',
  bio: 'Passionate student developer building modern web applications, AI tools, and sleek user experiences on Freeverse.',
  about: 'I build end-to-end web applications, interactive visual tools, and AI-powered utilities for student communities and digital projects.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'AI APIs'],
  technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Vite'],
  projects: [
    {
      id: 'owner-proj-1',
      title: 'Freeverse Core Platform',
      description: 'A student networking and freelancer showcase platform empowering university creators to manage portfolios and connect.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
      category: 'WEB DEVELOPMENT',
      projectLink: 'https://freeverse.dev',
      githubLink: 'https://github.com/sanmathi8/Freeverse-website',
      completionYear: '2024',
    },
  ],
  featuredProject: 'Freeverse Core Platform',
  projectCount: 1,
  category: ['WEB DEVELOPMENT', 'CODING', 'AI'],
  education: 'B.Tech Computer Science, 2025',
  services: ['BUILD A WEBSITE', 'AI PROJECT', 'CODING'],
  github: 'https://github.com/sanmathi8',
  linkedin: 'https://linkedin.com/in/sanmathi',
  portfolio: 'https://freeverse.dev',
  availability: 'Available for Hire',
  isOwner: true,
};

export const skillCategories = [
  'ALL',
  'WEB DEVELOPMENT',
  'UI/UX',
  'GRAPHIC DESIGN',
  'VIDEO EDITING',
  'CODING',
  'AI',
  'MOBILE DEVELOPMENT',
  'CONTENT CREATION',
] as const;

export function getAvatarFallback(name: string) {
  const initial = name ? name.charAt(0).toUpperCase() : 'F';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%230ea5e9"/>
        <stop offset="100%" stop-color="%230284c7"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="100" fill="%230b1b2b"/>
    <circle cx="100" cy="100" r="94" fill="url(%23avatarGrad)" opacity="0.25"/>
    <circle cx="100" cy="75" r="34" fill="%2338bdf8"/>
    <path d="M40,165 C40,125 70,115 100,115 C130,115 160,125 160,165 Z" fill="%2338bdf8"/>
    <circle cx="100" cy="100" r="95" stroke="%2367e8f9" stroke-width="5" fill="none"/>
    <text x="100" y="112" font-size="44" font-family="system-ui, sans-serif" font-weight="800" fill="%23ffffff" text-anchor="middle">${initial}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoFreelancers: Freelancer[] = [
  {
    id: 'demo-1',
    name: 'Aarav Kumar',
    title: 'Full Stack Developer',
    about: 'DEMO PROFILE — Passionate full-stack developer specializing in modern web applications. Loves turning ideas into scalable products.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces&q=80',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Git'],
    projects: [
      {
        id: 'p1',
        title: 'CampusConnect',
        description: 'SAMPLE PROJECT — A student networking platform for college communities with real-time chat and event discovery.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      },
      {
        id: 'p2',
        title: 'StudySync',
        description: 'SAMPLE PROJECT — Collaborative study group finder with resource sharing and progress tracking.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
        technologies: ['Next.js', 'PostgreSQL', 'Prisma'],
      },
    ],
    featuredProject: 'CampusConnect',
    projectCount: 2,
    category: ['WEB DEVELOPMENT', 'CODING'],
  },
  {
    id: 'demo-2',
    name: 'Priya Sharma',
    title: 'UI/UX Designer',
    about: 'DEMO PROFILE — Designer focused on clean interfaces and delightful user experiences for student and edtech products.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80',
    skills: ['Figma', 'UI Design', 'Prototyping', 'User Research', 'Design Systems'],
    technologies: ['Figma', 'Adobe XD', 'Framer', 'Principle', 'HTML/CSS'],
    projects: [
      {
        id: 'p3',
        title: 'LearnFlow App',
        description: 'SAMPLE PROJECT — Mobile-first learning dashboard redesign with improved accessibility and engagement metrics.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        technologies: ['Figma', 'Design System', 'Prototyping'],
      },
    ],
    featuredProject: 'LearnFlow App',
    projectCount: 1,
    category: ['UI/UX', 'GRAPHIC DESIGN'],
  },
  {
    id: 'demo-3',
    name: 'Rohan Mehta',
    title: 'AI & ML Specialist',
    about: 'DEMO PROFILE — Building practical AI tools for students. Experienced in computer vision and NLP projects.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=80',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'FastAPI'],
    projects: [
      {
        id: 'p4',
        title: 'SmartNotes AI',
        description: 'SAMPLE PROJECT — AI-powered lecture note summarizer and quiz generator for students.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
        technologies: ['Python', 'Transformers', 'FastAPI', 'React'],
      },
    ],
    featuredProject: 'SmartNotes AI',
    projectCount: 1,
    category: ['AI', 'CODING'],
  },
  {
    id: 'demo-4',
    name: 'Ananya Patel',
    title: 'Graphic Designer',
    about: 'DEMO PROFILE — Creating visual identities, posters and brand systems for student clubs and startups.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces&q=80',
    skills: ['Illustrator', 'Photoshop', 'Brand Identity', 'Poster Design', 'Typography'],
    technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma'],
    projects: [
      {
        id: 'p5',
        title: 'TechFest Identity',
        description: 'SAMPLE PROJECT — Complete visual identity and poster series for a college technical festival.',
        image: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=600&h=400&fit=crop',
        technologies: ['Illustrator', 'Photoshop', 'Brand System'],
      },
    ],
    featuredProject: 'TechFest Identity',
    projectCount: 1,
    category: ['GRAPHIC DESIGN', 'CONTENT CREATION'],
  },
  {
    id: 'demo-5',
    name: 'Vikram Singh',
    title: 'Mobile App Developer',
    about: 'DEMO PROFILE — Flutter and React Native developer building cross-platform student utility apps.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=80',
    skills: ['Flutter', 'React Native', 'Dart', 'Firebase', 'UI Implementation'],
    technologies: ['Flutter', 'Dart', 'React Native', 'Firebase', 'Riverpod'],
    projects: [
      {
        id: 'p6',
        title: 'CampusGo',
        description: 'SAMPLE PROJECT — All-in-one campus navigation and event app with offline maps and notifications.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58b43e1?w=600&h=400&fit=crop',
        technologies: ['Flutter', 'Firebase', 'Google Maps'],
      },
    ],
    featuredProject: 'CampusGo',
    projectCount: 1,
    category: ['MOBILE DEVELOPMENT', 'CODING'],
  },
  {
    id: 'demo-6',
    name: 'Sneha Reddy',
    title: 'Video Editor & Motion Designer',
    about: 'DEMO PROFILE — Crafting engaging video content, reels and motion graphics for student projects and events.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces&q=80',
    skills: ['Premiere Pro', 'After Effects', 'Motion Graphics', 'Color Grading', 'Storytelling'],
    technologies: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Cinema 4D'],
    projects: [
      {
        id: 'p7',
        title: 'Event Highlight Reel',
        description: 'SAMPLE PROJECT — Cinematic after-movie for a 3-day student tech summit with custom motion graphics.',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
        technologies: ['Premiere Pro', 'After Effects', 'Sound Design'],
      },
    ],
    featuredProject: 'Event Highlight Reel',
    projectCount: 1,
    category: ['VIDEO EDITING', 'CONTENT CREATION'],
  },
];

export const serviceToCategory: Record<string, string[]> = {
  'BUILD A WEBSITE': ['WEB DEVELOPMENT', 'CODING'],
  'UI/UX DESIGN': ['UI/UX'],
  'GRAPHIC DESIGN': ['GRAPHIC DESIGN'],
  'VIDEO EDITING': ['VIDEO EDITING'],
  'AI PROJECT': ['AI'],
  'MOBILE APP': ['MOBILE DEVELOPMENT'],
  'CODING': ['CODING', 'WEB DEVELOPMENT'],
  'POSTER / CREATIVE DESIGN': ['GRAPHIC DESIGN', 'CONTENT CREATION'],
};
