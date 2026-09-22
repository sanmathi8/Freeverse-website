export default function FinalCTA() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="join" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Your skills deserve to be seen.
        </h2>
        <p className="mb-10 text-lg text-slate-400">
          Join Freeverse. Build your skills. Showcase your work. Discover opportunities.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => scrollTo('#freelancers')}
            className="w-full rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 sm:w-auto"
          >
            JOIN FREEVERSE
          </button>
          <button
            type="button"
            onClick={() => scrollTo('#freelancers')}
            className="w-full rounded-full border border-slate-600 bg-slate-900/50 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-slate-400 sm:w-auto"
          >
            EXPLORE FREELANCERS
          </button>
        </div>
      </div>
    </section>
  );
}
