import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, X, Code2 } from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  creator: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
}

const featuredProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'CampusConnect Platform',
    category: 'WEB DEVELOPMENT',
    creator: 'Aarav Kumar',
    description: 'A student networking and resource sharing platform with real-time chat, study group finders, and event discovery.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
  },
  {
    id: 'proj-2',
    title: 'LearnFlow Dashboard UI',
    category: 'UI/UX DESIGN',
    creator: 'Priya Sharma',
    description: 'Mobile-first learning analytics dashboard with customizable widgets, progress tracking, and accessible color tokens.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    technologies: ['Figma', 'Design System', 'Prototyping', 'Framer'],
  },
  {
    id: 'proj-3',
    title: 'SmartNotes AI Assistant',
    category: 'AI / MACHINE LEARNING',
    creator: 'Rohan Mehta',
    description: 'AI-powered lecture note summarizer and automated quiz generator for university study groups.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    technologies: ['Python', 'Transformers', 'FastAPI', 'React', 'Tailwind'],
  },
  {
    id: 'proj-4',
    title: 'CampusGo Mobile App',
    category: 'MOBILE DEVELOPMENT',
    creator: 'Vikram Singh',
    description: 'Cross-platform campus navigation app with offline vector maps, shuttle schedule alerts, and event notifications.',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=500&fit=crop',
    technologies: ['Flutter', 'Dart', 'Firebase', 'Google Maps API'],
  },
  {
    id: 'proj-5',
    title: 'TechFest Identity System',
    category: 'GRAPHIC DESIGN',
    creator: 'Ananya Patel',
    description: 'Complete visual identity, 3D motion graphics, and poster series for an annual national student summit.',
    image: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=800&h=500&fit=crop',
    technologies: ['Illustrator', 'Photoshop', 'After Effects', 'Cinema 4D'],
  },
  {
    id: 'proj-6',
    title: 'Summit Highlight Film',
    category: 'VIDEO EDITING',
    creator: 'Sneha Reddy',
    description: 'Cinematic recap after-movie for a 3-day tech conference featuring custom 3D typography and sound design.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=500&fit=crop',
    technologies: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400" />
            <span>STUDENT SHOWCASE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            BUILT BY <span className="text-prismatic">FREEVERSE</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-slate-700 dark:text-slate-200 sm:text-lg">
            A curated showcase of real projects, software applications, and creative designs built by student creators.
          </p>
        </div>

        {/* Asymmetric Project Gallery */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((proj) => (
            <motion.div
              key={proj.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="glass-strong group flex flex-col overflow-hidden rounded-3xl border border-sky-200/80 dark:border-sky-500/30 shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'500\' viewBox=\'0 0 800 500\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%230f172a\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%2338bdf8\' font-size=\'24\' font-weight=\'bold\' font-family=\'sans-serif\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EFREEVERSE PROJECT%3C/text%3E%3C/svg%3E';
                  }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white backdrop-blur-md border border-white/20">
                  {proj.category}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    By {proj.creator}
                  </span>
                  <h3 className="mt-1 mb-2 text-xl font-extrabold text-slate-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {proj.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {proj.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(proj)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-3 text-xs font-extrabold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-md"
                >
                  <span>View Showcase</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal Viewer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-strong relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-sky-300/50 dark:border-sky-500/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900/80 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="aspect-[16/9] w-full object-cover"
              />

              <div className="p-6 sm:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-extrabold uppercase text-sky-600 dark:text-sky-300 border border-sky-500/20">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs text-slate-500">Built by {selectedProject.creator}</span>
                </div>

                <h3 className="mb-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h3>
                <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedProject.description}
                </p>

                <div className="mb-6">
                  <h4 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                    <Code2 size={14} className="text-sky-500" />
                    <span>Technologies Used</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg"
                >
                  Close Showcase
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
