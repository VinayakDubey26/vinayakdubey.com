import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getProjectImage } from "../data/projectsData";

const MobileAppCard = ({ project, onViewDetails, dragRef }) => {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const arrowRef = useRef(null);

  const hero = getProjectImage(project.folder, project.images[0]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onEnter = () => {
      gsap.to(imgRef.current, { scale: 1.03, duration: 0.45, ease: "power2.out" });
      gsap.to(arrowRef.current, { x: 4, duration: 0.45, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(imgRef.current, { scale: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(arrowRef.current, { x: 0, duration: 0.45, ease: "power2.out" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
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
      <div className="flex flex-col h-full" style={{ padding: "clamp(24px, 3vw, 38px)" }}>
        <div className="mb-[14px] md:mb-[18px]">
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Mobile Application
          </span>
          <h3 className="text-base md:text-lg font-semibold text-white mt-0.5">{project.title}</h3>
        </div>

        <div className="flex-1 relative w-full overflow-hidden rounded-[16px]">
          <div ref={imgRef} className="w-full h-full will-change-transform">
            <img src={hero} alt={project.title}
              className="w-full h-full object-cover"
              draggable={false} />
          </div>
        </div>

        <p className="mt-[14px] md:mt-[18px] text-xs md:text-[13px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", maxWidth: "620px", lineHeight: "1.5" }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-[12px] md:mt-[14px]">
          {project.technologies?.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(214,168,79,0.1)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(214,168,79,0.08)" }}>
              {t}
            </span>
          ))}
        </div>

        <div className="mt-[14px] md:mt-[18px]">
          <button onClick={handleClick}
            className="text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
            View Details <span ref={arrowRef}>→</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default MobileAppCard;
