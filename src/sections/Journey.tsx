import { motion } from 'framer-motion';
import { Sparkles, UserPlus, BookOpen, Hammer, Eye, Users, Briefcase, Award } from 'lucide-react';

const journeySteps = [
  { num: '01', title: 'JOIN', desc: 'Become part of the Freeverse student community.', icon: UserPlus, color: 'from-sky-400 to-blue-500' },
  { num: '02', title: 'LEARN', desc: 'Develop technical and creative skills guided by peers.', icon: BookOpen, color: 'from-cyan-400 to-teal-500' },
  { num: '03', title: 'BUILD', desc: 'Create projects and build practical software.', icon: Hammer, color: 'from-teal-400 to-emerald-500' },
  { num: '04', title: 'SHOWCASE', desc: 'Curate your public portfolio & verified work.', icon: Eye, color: 'from-amber-400 to-orange-500' },
  { num: '05', title: 'CONNECT', desc: 'Network with creators, mentors and clients.', icon: Users, color: 'from-pink-400 to-rose-500' },
  { num: '06', title: 'FREELANCE', desc: 'Get discovered for real client assignments.', icon: Briefcase, color: 'from-purple-400 to-indigo-500' },
  { num: '07', title: 'OPPORTUNITY', desc: 'Unlock paid work, internships & career paths.', icon: Award, color: 'from-blue-500 to-sky-400' },
];

export default function Journey() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400" />
            <span>STUDENT ROADMAP</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            FROM STUDENT TO <span className="text-prismatic">OPPORTUNITY</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
            A clear 7-step path from joining the community to finding meaningful paid work.
          </p>
        </div>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="absolute left-0 right-0 top-10 hidden h-1 bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-500 rounded-full lg:block opacity-40" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-7">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div
                    className={`relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-xl shadow-sky-500/15`}
                  >
                    <Icon size={24} />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-extrabold text-white border border-white/40">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xs font-extrabold tracking-wider text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-200">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
