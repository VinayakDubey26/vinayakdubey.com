import { useEffect, useRef, useState, useCallback } from "react";
import { getProjectImage, isVideoFile } from "../data/projectsData";

const statusColors = {
  Live: "#34d399",
  Built: "#34d399",
  "In Development": "#facc15",
  Prototype: "#60a5fa",
  Concept: "#c084fc",
};

const ProjectModal = ({ project, onClose }) => {
  const scrollerRef = useRef(null);
  const sectionsRef = useRef([]);
  const [index, setIndex] = useState(0);

  const images = project.images || [];
  const total = images.length;

  const scrollTo = useCallback((i) => {
    const el = sectionsRef.current[i];
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goNext = useCallback(() => {
    const next = Math.min(index + 1, total);
    setIndex(next);
    scrollTo(next);
  }, [index, total, scrollTo]);

  const goPrev = useCallback(() => {
    const prev = Math.max(index - 1, 0);
    setIndex(prev);
    scrollTo(prev);
  }, [index, scrollTo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    sectionsRef.current = [];
    setIndex(0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [project.id, images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white">
      {/* Top bar */}
      <div
        className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-3 md:px-5 py-2 md:py-4 pointer-events-none"
        style={{ paddingTop: "env(safe-area-inset-top, 8px)" }}
      >
        <button
          onClick={onClose}
          className="pointer-events-auto rounded-full bg-black/40 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white/90 hover:bg-black/60 transition border border-white/10 active:scale-[0.95]"
          style={{ touchAction: "manipulation" }}
          aria-label="Close project viewer"
        >
          ← Back to Projects
        </button>

        {total > 0 && (
          <span className="text-xs md:text-sm text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full tabular-nums border border-white/10 select-none">
            {index + 1} / {total}
          </span>
        )}

        <button
          onClick={onClose}
          className="pointer-events-auto rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 md:py-2 text-base md:text-lg text-white/90 hover:bg-black/60 transition border border-white/10 active:scale-[0.95]"
          style={{ touchAction: "manipulation" }}
          aria-label="Close viewer"
        >
          ×
        </button>
      </div>

      {/* Side navigation */}
      {total > 0 && (
        <>
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 backdrop-blur-md w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition border border-white/10 disabled:opacity-20 disabled:cursor-default active:scale-[0.9]"
            style={{ touchAction: "manipulation" }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={goNext}
            disabled={index >= total}
            className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 backdrop-blur-md w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition border border-white/10 disabled:opacity-20 disabled:cursor-default active:scale-[0.9]"
            style={{ touchAction: "manipulation" }}
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      {/* Scroll container */}
      <div
        ref={scrollerRef}
        className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {images.map((file, i) => {
          const url = getProjectImage(project.folder, file);
          return (
            <section
              key={file}
              ref={(el) => (sectionsRef.current[i] = el)}
              className="h-svh w-full flex items-center justify-center bg-[#050505]"
            >
              {isVideoFile(file) ? (
                <video
                  src={url}
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="metadata"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  aria-label={`${project.title} screenshot ${i + 1}`}
                />
              ) : (
                <img
                  src={url}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              )}
            </section>
          );
        })}

        {/* Project info */}
        <div
          className="bg-[#050505] px-5 md:px-10 py-16 md:py-24"
          style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="max-w-[900px] mx-auto">
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: statusColors[project.status] || "#999" }}
            >
              {project.status}
            </span>

            <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">
              {project.title}
            </h2>

            <p className="mt-4 text-sm md:text-base leading-relaxed text-white/60 max-w-[700px]">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/8 px-3.5 py-1.5 text-xs text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>

            <a
              href={project.liveUrl || "#"}
              target={project.liveUrl ? "_blank" : undefined}
              rel={project.liveUrl ? "noopener noreferrer" : undefined}
              className={`mt-8 inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition active:scale-[0.97] ${
                project.liveUrl
                  ? "bg-white/10 hover:bg-white/16"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
              style={{ touchAction: "manipulation" }}
              onClick={project.liveUrl ? undefined : (e) => e.preventDefault()}
            >
              Visit Website ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
