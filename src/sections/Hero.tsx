import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onEnterFreeverse?: () => void;
}

const journeySequence = [
  { step: 'STUDENT', label: 'Student Joins', color: 'from-sky-500 to-blue-600' },
  { step: 'SKILLS', label: 'Develops Skills', color: 'from-cyan-500 to-teal-600' },
  { step: 'CREATE', label: 'Builds Projects', color: 'from-teal-500 to-emerald-600' },
  { step: 'SHOWCASE', label: 'Curates Portfolio', color: 'from-amber-500 to-orange-600' },
  { step: 'CONNECT', label: 'Discovered by Clients', color: 'from-pink-500 to-rose-600' },
  { step: 'FREELANCE', label: 'Secures Gigs', color: 'from-purple-500 to-indigo-600' },
  { step: 'OPPORTUNITY', label: 'Career Growth', color: 'from-blue-600 to-sky-500' },
];

export default function Hero({ onEnterFreeverse }: HeroProps) {
  const prefersReduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnterTrigger = () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    if (onEnterFreeverse) onEnterFreeverse();

    let step = 0;
    setActiveStep(0);

    const interval = setInterval(() => {
      step++;
      if (step < journeySequence.length) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlayingSequence(false);
        }, 1500);
      }
    }, 450);
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-24 pb-16"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-extrabold tracking-wider text-sky-800 dark:text-sky-300 mb-6 backdrop-blur-md max-w-full"
            >
              <Sparkles size={14} className="text-sky-500 animate-pulse shrink-0" />
              <span className="truncate">STUDENT DIGITAL ECOSYSTEM</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4 text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12] sm:leading-[1.08] break-words"
            >
              TURN YOUR SKILLS <br className="hidden xs:inline" />
              <span className="text-prismatic">INTO OPPORTUNITIES.</span>
            </motion.h1>

            {/* Animated Tagline Sequence */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 w-full max-w-full overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-100">
                {['LEARN', 'CREATE', 'SHOWCASE', 'CONNECT', 'FREELANCE'].map((word, index, arr) => (
                  <div key={word} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="relative rounded-xl border border-sky-400/40 bg-sky-500/10 px-2.5 sm:px-3 py-1 text-sky-800 dark:text-sky-300 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:border-sky-400 hover:bg-sky-500/20">
                      {word}
                    </span>
                    {index < arr.length - 1 && (
                      <span className="text-sky-400/80 font-extrabold text-xs animate-pulse">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Paragraph Description */}
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto lg:mx-0 mb-8 max-w-xl text-base leading-relaxed text-slate-700 dark:text-slate-200 font-semibold sm:text-lg"
            >
              FREEVERSE is a bright crystalline ecosystem where students build real-world projects, showcase creative portfolios, and get discovered by clients for freelance work.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start w-full max-w-full"
            >
              <button
                type="button"
                onClick={() => scrollTo('#join')}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-sky-500/25 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <span>JOIN FREEVERSE</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#freelancers')}
                className="glass-crystal inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
              >
                <span>EXPLORE FREELANCERS</span>
              </button>
            </motion.div>

            {/* Signature Animation Trigger */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-col items-center lg:items-start w-full max-w-full"
            >
              <button
                type="button"
                onClick={handleEnterTrigger}
                disabled={isPlayingSequence}
                className={`group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full border px-4 sm:px-5 py-2.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all max-w-full ${
                  isPlayingSequence
                    ? 'border-teal-500 bg-teal-500/20 text-teal-800 dark:text-teal-300'
                    : 'border-sky-400 bg-sky-500/10 text-sky-800 dark:text-sky-300 hover:bg-sky-500/20 hover:scale-105'
                }`}
              >
                <div className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white ${isPlayingSequence ? 'animate-spin' : ''}`}>
                  <Play size={10} className="fill-current ml-0.5 sm:hidden" />
                  <Play size={12} className="fill-current ml-0.5 hidden sm:block" />
                </div>
                <span className="text-center sm:text-left leading-tight">
                  {isPlayingSequence ? 'SIMULATING FREEVERSE FLOW...' : 'ENTER THE FREEVERSE (INTERACTIVE TRIGGER)'}
                </span>
              </button>

              {/* Active Sequence Status Bar */}
              {activeStep !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 rounded-xl bg-slate-900 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold text-sky-300 shadow-lg backdrop-blur-md border border-sky-400 max-w-full"
                >
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span className="truncate">
                    STAGE {activeStep + 1}/{journeySequence.length}:{' '}
                    <span className="text-amber-300">{journeySequence[activeStep].step}</span> → {journeySequence[activeStep].label}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column Interactive Visual Cards */}
          <div className="lg:col-span-5 relative w-full max-w-full">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="glass-strong relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 border border-sky-300/80 dark:border-sky-500/40 shadow-2xl w-full max-w-full">
                <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full bg-sky-500 animate-ping" />
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-sky-800 dark:text-sky-300 truncate">
                      LIVE STUDENT PIPELINE
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    ACTIVE
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-2.5 sm:space-y-3">
                  {journeySequence.map((item, idx) => {
                    const isActive = activeStep === idx;
                    const isPassed = activeStep !== null && activeStep > idx;

                    return (
                      <div
                        key={item.step}
                        className={`flex items-center justify-between rounded-xl p-2.5 sm:p-3 text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-[1.01]`
                            : isPassed
                            ? 'bg-sky-50 dark:bg-slate-800/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30'
                            : 'glass-panel text-slate-800 dark:text-slate-300 hover:border-sky-400/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <span
                            className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-extrabold ${
                              isActive ? 'bg-white text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="truncate">{item.step}</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold opacity-95 text-right shrink-0 ml-2">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-12 flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400">
        <span className="text-[10px] font-extrabold uppercase tracking-widest">SCROLL TO DISCOVER UNIVERSE</span>
        <div className="h-6 w-0.5 bg-gradient-to-b from-sky-500 to-transparent animate-bounce" />
      </div>
    </section>
  );
}
