// Placeholder resume download. Replace the href with the real asset path
// (e.g. "/resume.pdf") and remove the onClick guard once the resume is ready.
const ResumeLink = ({ layout = "icon", className = "" }) => {
  const handleClick = (e) => e.preventDefault();

  if (layout === "row") {
    return (
      <a
        href="#"
        onClick={handleClick}
        aria-label="Download resume (coming soon)"
        title="Resume coming soon"
        className={`group flex items-center gap-4 rounded-xl border border-white/10 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-white/25 hover:bg-white/8 ${className}`}
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-white/80 group-hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5" />
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          Résumé
        </span>
        <span className="hidden text-xs text-white/35 sm:block">
          Download PDF (coming soon)
        </span>
        <span className="ml-auto text-white/35 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-white/70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
          </svg>
        </span>
      </a>
    );
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      aria-label="Download resume (coming soon)"
      title="Resume coming soon"
      className={`flex h-[44px] w-[44px] md:h-[54px] md:w-[54px] flex-none items-center justify-center rounded-full border border-[#111111]/25 text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.08] active:scale-[0.96] ${className}`}
      style={{
        background: "rgba(255,255,255,0.6)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5" />
        <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </svg>
    </a>
  );
};

export default ResumeLink;
