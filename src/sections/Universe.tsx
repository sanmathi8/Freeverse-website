import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Hammer, Rocket, Eye, Users, Briefcase, Award } from 'lucide-react';

const universeNodes = [
  {
    id: 'learn',
    title: 'LEARN',
    icon: BookOpen,
    desc: 'Develop technical and creative skills through workshops, peer learning, and hands-on guidance.',
    color: 'from-cyan-400 to-sky-500',
    borderColor: 'border-cyan-400',
  },
  {
    id: 'create',
    title: 'CREATE',
    icon: Hammer,
    desc: 'Experiment with modern tools, framework stack, AI algorithms, and design systems.',
    color: 'from-sky-400 to-blue-600',
    borderColor: 'border-sky-400',
  },
  {
    id: 'build',
    title: 'BUILD',
    icon: Rocket,
    desc: 'Turn concepts into real, shippable projects and hackathon solutions.',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
  },
  {
    id: 'showcase',
    title: 'SHOWCASE',
    icon: Eye,
    desc: 'Curate high-impact portfolios and display projects for public evaluation.',
    color: 'from-teal-400 to-emerald-500',
    borderColor: 'border-teal-400',
  },
  {
    id: 'connect',
    title: 'CONNECT',
    icon: Users,
    desc: 'Network with fellow creators, student developers, mentors, and industry leads.',
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-400',
  },
  {
    id: 'freelance',
    title: 'FREELANCE',
    icon: Briefcase,
    desc: 'Get discovered by clients and take on real paid freelance assignments while studying.',
    color: 'from-pink-400 to-rose-500',
    borderColor: 'border-pink-400',
  },
  {
    id: 'opportunity',
    title: 'OPPORTUNITY',
    icon: Award,
    desc: 'Unlock internships, client contracts, and long-term career growth.',
    color: 'from-purple-400 to-indigo-500',
    borderColor: 'border-purple-400',
  },
];

export default function Universe() {
  const [selectedNode, setSelectedNode] = useState(universeNodes[0]);

  return (
    <section id="universe" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400 animate-spin-slow" />
            <span>THE DIGITAL SYSTEM</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            THE FREEVERSE <span className="text-prismatic">UNIVERSE</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            An interconnected digital world where every student step powers the next stage of growth.
          </p>
        </div>

        {/* Interactive Universe Constellation Grid */}
        <div className="relative mx-auto max-w-5xl">
          {/* Central FREEVERSE Core Node */}
          <div className="mb-12 flex justify-center">
            <div className="glass-crystal relative flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-sky-400 bg-gradient-to-br from-sky-400/20 via-blue-500/20 to-teal-400/20 shadow-2xl glow-cyan transition-transform duration-500 hover:scale-110">
              <div className="text-center">
                <Sparkles size={24} className="mx-auto text-sky-500 dark:text-sky-300 animate-bounce" />
                <span className="text-xs font-extrabold tracking-widest text-slate-900 dark:text-white">FREEVERSE</span>
              </div>
            </div>
          </div>

          {/* Surrounding Nodes */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {universeNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const Icon = node.icon;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setSelectedNode(node)}
                  className={`group relative flex flex-col items-center rounded-2xl p-4 transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? 'glass-strong scale-105 border-2 border-sky-400 shadow-xl glow-cyan'
                      : 'glass-panel hover:scale-102 hover:border-sky-300/50'
                  }`}
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${node.color} text-white shadow-md transition-transform group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100">
                    {node.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Info Card */}
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 glass-strong relative overflow-hidden rounded-3xl p-8 border border-sky-300/50 dark:border-sky-500/40 shadow-2xl"
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedNode.color} text-white shadow-lg`}
              >
                <selectedNode.icon size={28} />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                    UNIVERSE NODE
                  </span>
                  <span className="h-1 w-1 rounded-full bg-sky-400" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    STAGE {universeNodes.findIndex((n) => n.id === selectedNode.id) + 1} OF 7
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedNode.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed font-semibold text-slate-700 dark:text-slate-200">
                  {selectedNode.desc}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
