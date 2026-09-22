import { motion } from 'framer-motion';
import { Sparkles, Trophy, Lightbulb, Zap, Code, HeartHandshake } from 'lucide-react';

const wallItems = [
  {
    id: 'w1',
    type: 'ACHIEVEMENT',
    title: 'Hackathon Victory',
    desc: '3 Freeverse student teams placed top 3 at the State Web3 Hackathon!',
    icon: Trophy,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'w2',
    type: 'IDEA',
    title: 'AI Note Summarizer',
    desc: 'New open-source student project started: Automated lecture transcript summarizer.',
    icon: Lightbulb,
    color: 'from-sky-400 to-blue-600',
  },
  {
    id: 'w3',
    type: 'FREELANCE',
    title: 'EdTech Gig Completed',
    desc: 'Aarav & Priya delivered a full-stack learning platform to an EdTech startup.',
    icon: HeartHandshake,
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'w4',
    type: 'WORKSHOP',
    title: 'React Patterns Lab',
    desc: '50+ students completed the hands-on React 19 & Next.js performance lab.',
    icon: Code,
    color: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'w5',
    type: 'SPOTLIGHT',
    title: 'UI/UX Design Systems',
    desc: 'Priya Sharma released a free student Figma design system kit.',
    icon: Zap,
    color: 'from-pink-400 to-rose-500',
  },
];

export default function FreeverseWall() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400" />
            <span>COMMUNITY PULSE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            WHAT'S HAPPENING IN <span className="text-prismatic">FREEVERSE?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold text-slate-700 dark:text-slate-200">
            Ideas, achievements, hackathon wins, and ongoing student projects across our ecosystem.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wallItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-strong group rounded-3xl p-6 border border-sky-200/80 dark:border-sky-500/30 shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                    <Icon size={18} />
                  </div>
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    {item.type}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
