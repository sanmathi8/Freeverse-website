import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Layout,
  Cpu,
  Brain,
  ShieldCheck,
  Smartphone,
  Palette,
  Video,
  Database,
  Feather,
  Sparkles,
} from 'lucide-react';

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  glow: string;
  desc: string;
}

export const skillsList: SkillNode[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'WEB DEVELOPMENT',
    icon: Code,
    color: 'from-cyan-400 to-sky-500',
    glow: 'rgba(6, 182, 212, 0.4)',
    desc: 'React, Next.js, Node.js, TypeScript, Tailwind CSS, API design',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    category: 'UI/UX',
    icon: Layout,
    color: 'from-pink-400 to-rose-500',
    glow: 'rgba(244, 63, 94, 0.4)',
    desc: 'Figma, Design Systems, User Research, Wireframing, Prototyping',
  },
  {
    id: 'ai',
    name: 'AI Solutions',
    category: 'AI',
    icon: Cpu,
    color: 'from-sky-400 to-blue-600',
    glow: 'rgba(59, 130, 246, 0.4)',
    desc: 'LLMs, OpenAI API, PyTorch, Transformers, Prompt Engineering',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'AI',
    icon: Brain,
    color: 'from-indigo-400 to-purple-600',
    glow: 'rgba(129, 140, 248, 0.4)',
    desc: 'Python, TensorFlow, Scikit-Learn, Computer Vision, Data Science',
  },
  {
    id: 'cyber',
    name: 'Cyber Security',
    category: 'CODING',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-teal-600',
    glow: 'rgba(16, 185, 129, 0.4)',
    desc: 'Penetration Testing, Network Security, Encryption, Ethical Hacking',
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    category: 'MOBILE DEVELOPMENT',
    icon: Smartphone,
    color: 'from-blue-400 to-cyan-500',
    glow: 'rgba(56, 189, 248, 0.4)',
    desc: 'Flutter, React Native, iOS, Android, Firebase integration',
  },
  {
    id: 'graphic',
    name: 'Graphic Design',
    category: 'GRAPHIC DESIGN',
    icon: Palette,
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.4)',
    desc: 'Illustrator, Photoshop, Brand Identity, Vector Art, Typography',
  },
  {
    id: 'video',
    name: 'Video Editing',
    category: 'VIDEO EDITING',
    icon: Video,
    color: 'from-teal-400 to-emerald-500',
    glow: 'rgba(20, 184, 166, 0.4)',
    desc: 'Premiere Pro, After Effects, Motion Graphics, Color Grading',
  },
  {
    id: 'data',
    name: 'Data Science',
    category: 'AI',
    icon: Database,
    color: 'from-rose-400 to-pink-500',
    glow: 'rgba(244, 63, 94, 0.4)',
    desc: 'Pandas, SQL, Data Visualization, Analytics, Statistical Modeling',
  },
  {
    id: 'content',
    name: 'Content Creation',
    category: 'CONTENT CREATION',
    icon: Feather,
    color: 'from-purple-400 to-indigo-500',
    glow: 'rgba(168, 85, 247, 0.4)',
    desc: 'Copywriting, Technical Writing, Social Media Strategy, Storytelling',
  },
];

interface SkillConstellationProps {
  onSelectSkill?: (category: string) => void;
}

export default function SkillConstellation({ onSelectSkill }: SkillConstellationProps) {
  const [activeSkill, setActiveSkill] = useState<SkillNode>(skillsList[0]);

  const handleSkillClick = (skill: SkillNode) => {
    setActiveSkill(skill);
    if (onSelectSkill) {
      onSelectSkill(skill.category);
    }
  };

  return (
    <div className="relative py-8">
      {/* Skill Nodes Grid */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {skillsList.map((skill) => {
          const isSelected = activeSkill.id === skill.id;
          const Icon = skill.icon;

          return (
            <motion.button
              key={skill.id}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => handleSkillClick(skill)}
              className={`group relative flex items-center gap-2.5 rounded-full px-5 py-3 text-xs font-bold transition-all duration-300 focus:outline-none ${
                isSelected
                  ? 'bg-gradient-to-r ' + skill.color + ' text-white shadow-lg border border-white/40'
                  : 'glass-crystal text-slate-700 dark:text-slate-200 hover:border-sky-400/50'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-white' : 'text-sky-500 dark:text-sky-400'} />
              <span>{skill.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Skill Detail Popup */}
      <motion.div
        key={activeSkill.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-8 max-w-xl glass-strong rounded-2xl p-6 border border-sky-300/50 dark:border-sky-500/40 text-center shadow-xl"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} className="text-sky-500" />
          <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{activeSkill.name}</h4>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{activeSkill.desc}</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20">
          CATEGORY: {activeSkill.category}
        </span>
      </motion.div>
    </div>
  );
}
