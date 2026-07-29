import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getProjectImage } from "../data/projectsData";

const DesktopSoftwareCard = ({ project, onViewDetails, dragRef }) => {
  const cardRef = useRef(null);
  const windowRef = useRef(null);
  const screenshotRef = useRef(null);
  const pillsRef = useRef(null);
  const btnRef = useRef(null);

  const hero = getProjectImage(project.folder, project.images[0]);
  const capabilities = project.includes?.slice(0, 5) || [];

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {}, cardRef);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return () => ctx.revert();

    const onEnter = () => {
      gsap.to(windowRef.current, { y: -6, duration: 0.45, ease: "power2.out" });
      gsap.to(screenshotRef.current, { scale: 1.03, duration: 0.45, ease: "power2.out" });
      gsap.to(windowRef.current, { boxShadow: "0 12px 48px rgba(0,0,0,0.6)", duration: 0.45, ease: "power2.out" });
      gsap.to(pillsRef.current, { y: -4, opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(btnRef.current, { y: -6, duration: 0.45, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(windowRef.current, { y: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(screenshotRef.current, { scale: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(windowRef.current, { boxShadow: "0 4px 20px rgba(0,0,0,0.3)", duration: 0.45, ease: "power2.out" });
      gsap.to(pillsRef.current, { y: 0, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.to(btnRef.current, { y: 0, duration: 0.45, ease: "power2.out" });
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

  return (
    <article
      ref={cardRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !dragRef.current && onViewDetails(project)}
      className="card-item group relative shrink-0 rounded-[24px] overflow-hidden select-none cursor-grab active:cursor-grabbing w-[clamp(260px,75vw,480px)] md:w-[clamp(320px,48vw,520px)] lg:w-[clamp(420px,38vw,580px)] aspect-[4/3.5]"
      style={{ background: "#0C0C0C", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex flex-col h-full p-4 md:p-5">
        <div className="mb-3">
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            {project.categoryLabel || "Desktop Software"}
          </span>
          <h3 className="text-base md:text-lg font-semibold text-white mt-0.5">{project.title}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.technologies?.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
              {t}
            </span>
          ))}
        </div>

        <div ref={windowRef} className="flex-1 rounded-lg overflow-hidden flex flex-col"
          style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", background: "#111", minHeight: 0, willChange: "transform" }}>
          <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: "#1A1A1A", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F56" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27C93F" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 truncate">{project.title}</span>
          </div>
          <div ref={screenshotRef} className="flex-1 overflow-hidden bg-[#0D0D0D] flex items-center justify-center will-change-transform">
            <img src={hero} alt="" className="w-full h-full object-cover" draggable={false} />
          </div>
        </div>

        {capabilities.length > 0 && (
          <div ref={pillsRef} className="flex flex-wrap gap-1.5 mt-3" style={{ opacity: 0 }}>
            {capabilities.map((cap) => (
              <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.04)" }}>
                {cap}
              </span>
            ))}
          </div>
        )}

        <div ref={btnRef} className="mt-2">
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

export default DesktopSoftwareCard;
