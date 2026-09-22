import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { demoEvents, eventCategories, galleryImages, type EventItem } from '../data/events';

export default function Events() {
  const [filter, setFilter] = useState<string>('ALL');
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  const filtered =
    filter === 'ALL' ? demoEvents : demoEvents.filter((e) => e.category === filter);

  return (
    <section id="events" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-400" />
            <span>ACTIVITIES & WORKSHOPS</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            EVENTS & <span className="text-prismatic">ACTIVITIES</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold text-slate-700 dark:text-slate-200">
            Workshops, competitions, seminars, and technical labs — designed for student growth.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
          {eventCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2 text-xs font-extrabold tracking-wider uppercase transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 scale-105'
                  : 'glass-crystal text-slate-600 dark:text-slate-300 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="mb-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.article
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                className="glass-strong group flex flex-col overflow-hidden rounded-3xl border border-sky-200/80 dark:border-sky-500/30 shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'500\' viewBox=\'0 0 800 500\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%230f172a\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%2338bdf8\' font-size=\'24\' font-weight=\'bold\' font-family=\'sans-serif\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EFREEVERSE EVENT%3C/text%3E%3C/svg%3E';
                    }}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-white backdrop-blur-md border border-white/20">
                    {event.category}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed font-semibold text-slate-700 dark:text-slate-200">
                      {event.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(event)}
                    className="group/btn inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Past Event Gallery */}
        <div>
          <h3 className="mb-8 text-center text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Past Events Gallery
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {galleryImages.map((img) => (
              <motion.button
                key={img.id}
                whileHover={{ scale: 1.03 }}
                type="button"
                onClick={() => setLightbox({ src: img.src, label: img.label })}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shadow-md"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%230f172a\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%2338bdf8\' font-size=\'22\' font-weight=\'bold\' font-family=\'sans-serif\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EFREEVERSE GALLERY%3C/text%3E%3C/svg%3E';
                  }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 right-4 text-left text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {img.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={() => setSelected(null)}
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
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900/80 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <img
                src={selected.image}
                alt={selected.title}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="p-6 sm:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-extrabold uppercase text-sky-600 dark:text-sky-300 border border-sky-500/20">
                    {selected.category}
                  </span>
                  <span className="text-xs text-slate-500">{selected.date}</span>
                </div>
                <h3 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selected.title}
                </h3>
                <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-300">
                  {selected.longDescription}
                </p>
                {selected.gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {selected.gallery.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${selected.title} gallery ${i + 1}`}
                        className="aspect-video rounded-xl object-cover shadow-md"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
            onKeyDown={(e) => e.key === 'Escape' && setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.label}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-white">
              {lightbox.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
