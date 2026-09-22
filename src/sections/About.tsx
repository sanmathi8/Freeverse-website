import { motion } from 'framer-motion';
import {
  Lightbulb,
  Users,
  Sparkles,
  FolderKanban,
  Briefcase,
  Eye,
  Handshake,
  Rocket,
  BookOpen,
  Hammer,
  TrendingUp,
} from 'lucide-react';
import SkillConstellation from '../components/SkillConstellation';

const objectives = [
  { icon: Lightbulb, title: 'Skill Development', desc: 'Grow technical and creative abilities through guided practical learning.' },
  { icon: Users, title: 'Collaboration', desc: 'Work with peers on high-impact shared student projects.' },
  { icon: Sparkles, title: 'Innovation', desc: 'Experiment with cutting-edge tools, AI models, and design systems.' },
  { icon: FolderKanban, title: 'Project Building', desc: 'Turn concepts into real, shippable, public-facing applications.' },
  { icon: Briefcase, title: 'Portfolio Development', desc: 'Curate work that represents your highest professional capabilities.' },
  { icon: Eye, title: 'Industry Exposure', desc: 'Discover how academic skills translate to real client projects.' },
  { icon: Handshake, title: 'Freelancing Opportunities', desc: 'Connect talent directly with paid client assignments.' },
  { icon: Rocket, title: 'Technical & Creative Growth', desc: 'Balance craft, engineering, and professional career readiness.' },
];

const featurePillars = [
  {
    key: 'LEARN',
    title: 'Learn Skills',
    desc: 'Interactive workshops, peer mentorship, and practical coding labs.',
    icon: BookOpen,
    color: 'from-cyan-400 to-sky-500',
    borderColor: 'border-cyan-400/40',
  },
  {
    key: 'CREATE',
    title: 'Build Projects',
    desc: 'Collaborate in teams to create hackathon solutions and software.',
    icon: Hammer,
    color: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-400/40',
  },
  {
    key: 'CONNECT',
    title: 'Showcase Talent',
    desc: 'Public portfolios that showcase verified skills to prospective clients.',
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/40',
  },
  {
    key: 'GROW',
    title: 'Get Opportunities',
    desc: 'Secure paid freelance gigs, internships, and industry contracts.',
    icon: TrendingUp,
    color: 'from-amber-400 to-emerald-500',
    borderColor: 'border-amber-400/40',
  },
];

interface AboutProps {
  onSelectSkill?: (category: string) => void;
}

export default function About({ onSelectSkill }: AboutProps) {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400" />
            <span>DISCOVER FREEVERSE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            WHAT IS <span className="text-prismatic">FREEVERSE?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-slate-700 dark:text-slate-200 sm:text-lg">
            Freeverse is a bright crystalline ecosystem empowering students to learn, build, showcase, and monetize their skills.
          </p>
        </div>

        {/* Vision & Mission Asymmetric Crystal Cards */}
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-strong rounded-3xl p-8 border border-sky-300/60 dark:border-sky-500/40 shadow-xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400 border border-sky-500/20">
              VISION
            </div>
            <p className="text-xl font-bold leading-relaxed text-slate-900 dark:text-slate-100">
              Create a bright student ecosystem where creativity, code, and collaboration seamlessly transform into real freelance opportunities.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="glass-strong rounded-3xl p-8 border border-teal-300/60 dark:border-teal-500/40 shadow-xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400 border border-teal-500/20">
              MISSION
            </div>
            <p className="text-xl font-bold leading-relaxed text-slate-900 dark:text-slate-100">
              Bridge the gap between campus learning and industry freelancing by providing public project showcases and direct talent discovery.
            </p>
          </motion.div>
        </div>

        {/* Why Freeverse Four Pillars */}
        <div className="mb-24">
          <h3 className="mb-12 text-center text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Why Join Freeverse
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featurePillars.map((p, i) => {
              const Icon = p.icon;

              return (
                <motion.div
                  key={p.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`glass-strong relative overflow-hidden rounded-3xl p-6 border ${p.borderColor} shadow-xl`}
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-white shadow-md`}>
                    <Icon size={22} />
                  </div>
                  <div className="mb-2 text-xs font-extrabold tracking-widest text-sky-600 dark:text-sky-400">{p.key}</div>
                  <h4 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">{p.title}</h4>
                  <p className="text-sm leading-relaxed font-semibold text-slate-700 dark:text-slate-200">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Skill Constellation Section */}
        <div className="mb-24">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              CRYSTAL <span className="text-prismatic">SKILL CONSTELLATION</span>
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Explore key student skill clusters. Select any skill to filter creators and projects.
            </p>
          </div>
          <SkillConstellation onSelectSkill={onSelectSkill} />
        </div>

        {/* 8 Core Objectives */}
        <div>
          <h3 className="mb-10 text-center text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Freeverse Objectives
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {objectives.map((obj, i) => {
              const Icon = obj.icon;

              return (
                <motion.div
                  key={obj.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel group p-6 transition-all hover:border-sky-400 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-600 dark:text-sky-400 transition-transform group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <h4 className="mb-2 font-extrabold text-slate-900 dark:text-white">{obj.title}</h4>
                  <p className="text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-200">{obj.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
