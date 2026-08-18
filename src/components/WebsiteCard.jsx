import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getProjectImage } from "../data/projectsData";

const statusColors = {
  Live: { bg: "rgba(52,211,153,0.15)", color: "#34d399", border: "rgba(52,211,153,0.2)" },
  Built: { bg: "rgba(52,211,153,0.15)", color: "#34d399", border: "rgba(52,211,153,0.2)" },
  "In Development": { bg: "rgba(250,204,21,0.15)", color: "#facc15", border: "rgba(250,204,21,0.2)" },
  Prototype: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "rgba(96,165,250,0.2)" },
  Concept: { bg: "rgba(192,132,252,0.15)", color: "#c084fc", border: "rgba(192,132,252,0.2)" },
};

const WebsiteCard = ({ project, onViewDetails, dragRef }) => {
  const cardRef = useRef(null);
  const bgRef = useRef(null);
  const darkRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const techRef = useRef(null);
  const buttonsRef = useRef(null);
  const borderRef = useRef(null);

  const hero = getProjectImage(project.folder, project.images[0]);
  const isLive = !!project.liveUrl;
  const statusStyle = project.status ? statusColors[project.status] || statusColors.Concept : statusColors.Concept;
  const statusText = isLive ? "LIVE" : project.status?.toUpperCase() || "CONCEPT";

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {}, cardRef);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return () => ctx.revert();

    // Touch devices have no hover, so reveal the description and tech
    // chips permanently and drop the hover-only action buttons (tapping
    // the card opens the details anyway).
    if (window.matchMedia("(hover: none)").matches) {
      gsap.set([descRef.current, techRef.current], { opacity: 1 });
      if (buttonsRef.current) gsap.set(buttonsRef.current, { display: "none" });
      return () => ctx.revert();
    }

    const onEnter = () => {
      gsap.to(bgRef.current, { scale: 1.06, duration: 0.45, ease: "power2.out" });
      gsap.to(darkRef.current, { opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(titleRef.current, { y: -4, duration: 0.45, ease: "power2.out" });
      gsap.to(descRef.current, { y: -6, opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(techRef.current, { y: -4, opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(buttonsRef.current, { y: -8, duration: 0.45, ease: "power2.out" });
      gsap.to(borderRef.current, { opacity: 0.5, duration: 0.45, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(bgRef.current, { scale: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(darkRef.current, { opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(titleRef.current, { y: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(descRef.current, { y: 0, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(techRef.current, { y: 0, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(buttonsRef.current, { y: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(borderRef.current, { opacity: 0.2, duration: 0.45, ease: "power2.out" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleClick = (e) => {
    if (dragRef.current) { e.preventDefault(); return; }
    onViewDetails(project);
  };

  const handleVisit = (e) => {
    if (dragRef.current) e.preventDefault();
  };

  return (
    <article
      ref={cardRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !dragRef.current && onViewDetails(project)}
      className="card-item group relative shrink-0 rounded-[24px] overflow-hidden select-none cursor-grab active:cursor-grabbing w-[clamp(260px,75vw,480px)] md:w-[clamp(320px,48vw,520px)] lg:w-[clamp(420px,38vw,580px)] aspect-[4/3]"
      style={{ background: "#0A0A0A" }}
    >
      <div ref={borderRef} className="absolute inset-0 rounded-[24px] pointer-events-none z-20"
        style={{ border: "1px solid rgba(255,255,255,0.06)", opacity: 0.2 }} />

      <div ref={bgRef} className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${hero})` }} />

      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.45) 32%, rgba(5,5,5,0.12) 55%, transparent 75%)" }} />

      <div ref={darkRef} className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent 45%)", opacity: 0 }} />

      <div className="absolute top-3 left-3 z-20">
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
          {statusText}
        </span>
      </div>

      {project.categoryLabel && (
        <div className="absolute top-3 right-3 z-20">
          <span className="text-[10px] font-medium uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {project.categoryLabel}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-20 pointer-events-none">
        <h3 ref={titleRef} className="text-lg md:text-xl font-semibold text-white mb-1 leading-snug">
          {project.title}
        </h3>

        <p ref={descRef} className="text-xs leading-relaxed text-white/55 max-w-[92%] mb-2.5 line-clamp-3" style={{ opacity: 0 }}>
          {project.description}
        </p>

        <div ref={techRef} className="flex flex-wrap gap-1.5 mb-3" style={{ opacity: 0 }}>
          {project.technologies?.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
              {t}
            </span>
          ))}
        </div>

        <div ref={buttonsRef} className="flex gap-2 pointer-events-auto">
          {isLive && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); handleVisit(e); }}
              className="text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
              Visit Website ↗
            </a>
          )}
          <button onClick={handleClick}
            className="text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
            View Details →
          </button>
        </div>
      </div>
    </article>
  );
};

export default WebsiteCard;
