import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getProjectImage } from "../data/projectsData";

const PhoneBody = ({ src, alt }) => (
  <div style={{
    width: "100%", height: "100%",
    borderRadius: 40, background: "#fff", position: "relative",
    border: "1px solid rgba(180,180,185,0.3)",
    boxShadow: "0 30px 80px rgba(0,0,0,.35)",
    padding: "2.5px",
  }}>
    <div style={{
      width: "100%", height: "100%", borderRadius: 37,
      overflow: "hidden", background: "#000",
    }}>
      <img src={src} alt={alt} draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    </div>
    <div className="absolute pointer-events-none" style={{
      top: "7px", left: "50%", transform: "translateX(-50%)",
      width: "26px", height: "3px", background: "#111",
      borderRadius: "2px", zIndex: 3,
    }} />
    <div className="absolute pointer-events-none" style={{
      inset: 0, borderRadius: 40, zIndex: 2,
      background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 50%)",
    }} />
  </div>
);

const MobileAppCard = ({ project, onViewDetails, dragRef }) => {
  const cardRef = useRef(null);
  const mainRef = useRef(null);
  const supportTopRef = useRef(null);
  const supportBottomRef = useRef(null);
  const glowRef = useRef(null);
  const arrowRef = useRef(null);

  const mainImg = project.cardPreview
    ? getProjectImage(project.folder, project.cardPreview.center)
    : getProjectImage(project.folder, project.images[0]);
  const topImg = project.cardPreview
    ? getProjectImage(project.folder, project.cardPreview.right)
    : null;
  const bottomImg = project.cardPreview
    ? getProjectImage(project.folder, project.cardPreview.left)
    : null;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.set(mainRef.current, { scale: 1 });
      gsap.set(supportTopRef.current, { scale: 1 });
      gsap.set(supportBottomRef.current, { scale: 1 });
    }, cardRef);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return () => ctx.revert();

    const onEnter = () => {
      gsap.to(mainRef.current, { y: -8, scale: 1.03, duration: 0.45, ease: "power2.out" });
      if (supportTopRef.current) {
        gsap.to(supportTopRef.current, { x: 6, y: -4, duration: 0.45, ease: "power2.out" });
      }
      if (supportBottomRef.current) {
        gsap.to(supportBottomRef.current, { x: 6, y: -4, duration: 0.45, ease: "power2.out" });
      }
      gsap.to(glowRef.current, { opacity: 0.85, duration: 0.45, ease: "power2.out" });
      gsap.to(arrowRef.current, { x: 4, duration: 0.45, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(mainRef.current, { y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
      if (supportTopRef.current) {
        gsap.to(supportTopRef.current, { x: 0, y: 0, duration: 0.45, ease: "power2.out" });
      }
      if (supportBottomRef.current) {
        gsap.to(supportBottomRef.current, { x: 0, y: 0, duration: 0.45, ease: "power2.out" });
      }
      gsap.to(glowRef.current, { opacity: 0.65, duration: 0.45, ease: "power2.out" });
      gsap.to(arrowRef.current, { x: 0, duration: 0.45, ease: "power2.out" });
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
      <div className="flex flex-col h-full" style={{ padding: "clamp(16px, 2vw, 24px) clamp(24px, 3vw, 38px)" }}>
        <div className="mb-[10px] md:mb-[12px]">
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Mobile Application
          </span>
          <h3 className="text-base md:text-lg font-semibold text-white mt-0.5">{project.title}</h3>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center overflow-hidden min-h-0">
          <div className="w-full lg:w-[65%] h-full flex items-center justify-center relative">
            <div ref={glowRef} className="absolute pointer-events-none"
              style={{
                width: "min(320px, 80%)", height: "min(320px, 80%)", borderRadius: "50%",
                left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 0,
                background: "radial-gradient(circle at 50% 50%, rgba(214,168,79,0.12), rgba(214,168,79,0.035) 38%, transparent 70%)",
                opacity: 0.65,
              }}
            />
            {mainImg && (
              <div ref={mainRef} className="will-change-transform relative z-[1]"
                style={{ height: "clamp(180px, 30vw, 380px)", aspectRatio: "9/19.5", maxHeight: "92%" }}
              >
                <PhoneBody src={mainImg} alt={project.title} />
              </div>
            )}
          </div>

          <div className="hidden md:flex lg:flex-col w-full lg:w-[35%] h-full items-center justify-center gap-0">
            {topImg && (
              <div ref={supportTopRef} className="will-change-transform relative z-[2]"
                style={{ height: "clamp(90px, 14vw, 190px)", aspectRatio: "9/19.5", maxHeight: "48%" }}
              >
                <PhoneBody src={topImg} alt="" />
              </div>
            )}
            {bottomImg && (
              <div ref={supportBottomRef} className="will-change-transform relative z-[1]"
                style={{ height: "clamp(90px, 14vw, 190px)", aspectRatio: "9/19.5", maxHeight: "48%", marginTop: "-16px" }}
              >
                <PhoneBody src={bottomImg} alt="" />
              </div>
            )}
          </div>
        </div>

        <p className="mt-[10px] md:mt-[14px] text-xs md:text-[13px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", maxWidth: "620px", lineHeight: "1.5" }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-[8px] md:mt-[10px]">
          {project.technologies?.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(214,168,79,0.1)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(214,168,79,0.08)" }}>
              {t}
            </span>
          ))}
        </div>

        <div className="mt-[10px] md:mt-[12px]">
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
