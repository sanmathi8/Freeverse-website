import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OpportunityGateway() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="join" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-sky-300/60 dark:border-sky-500/40 shadow-2xl"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400 animate-bounce" />
            <span>OPPORTUNITY GATEWAY</span>
          </div>

          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-tight">
            YOUR SKILLS <br />
            <span className="text-prismatic">DESERVE TO BE SEEN.</span>
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-base font-semibold text-slate-700 dark:text-slate-200 sm:text-lg">
            Join Freeverse. Develop your skills. Build shippable projects. Showcase your portfolio. Connect with real freelance opportunities.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollTo('#freelancers')}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-sky-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              <span>JOIN FREEVERSE</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('#freelancers')}
              className="glass-crystal inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition-all hover:scale-105"
            >
              <span>EXPLORE TALENT</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
