import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { getProjectImage, isVideoFile } from "../data/projectsData";
import { useLenisRef } from "../context/ScrollContext";

function hexToRgb(hex) {
  const c = parseInt(hex.replace("#", ""), 16);
  return `${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}`;
}

const statusDot = {
  Live: "#34d399",
  Built: "#34d399",
  "In Development": "#facc15",
  Prototype: "#60a5fa",
  Concept: "#c084fc",
};

const statusLabel = {
  "In Development": "In Development",
  Prototype: "Prototype",
  Live: "Live",
  Built: "Built",
  Concept: "Concept",
};

const defaultAccent = "#A0A0A0";
const defaultSecondary = "#6B7B8D";

const sectionLabels = [
  { key: "overview", label: "Overview" },
  { key: "stack", label: "Stack" },
  { key: "features", label: "Features" },
  { key: "build", label: "Build" },
];

const statusBg = (status) => {
  const c = statusDot[status];
  return c ? `rgba(${hexToRgb(c)}, 0.12)` : "rgba(255,255,255,0.06)";
};

function StatusBadge({ status }) {
  const dotColor = statusDot[status] || "#999";
  const bg = statusBg(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest select-none"
      style={{ background: bg, color: dotColor }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      {statusLabel[status] || status}
    </span>
  );
}

function SectionMarker({ index, label, accent }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-[11px] font-semibold tracking-widest select-none"
        style={{ color: accent }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-widest text-white/30 select-none">
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

const ProjectModal = ({ project, onClose }) => {
  const accent = project.accent || defaultAccent;
  const accentRgb = hexToRgb(accent);
  const accentSecondary = project.accentSecondary || defaultSecondary;
  const accentSecondaryRgb = hexToRgb(accentSecondary);

  const images = project.images || [];
  const total = images.length;
  const lenisRefCtx = useLenisRef();
  const isSoftware = !!project.techStack;
  const isMobileSplit = project.detailVariant === "mobile-split";

  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const thumbStripRef = useRef(null);
  const mediaRefs = useRef([]);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const transitioning = useRef(false);
  const dragState = useRef({ isDown: false, startX: 0, moved: false });

  const headerRef = useRef(null);
  const overviewRef = useRef(null);
  const featuresRef = useRef(null);
  const buildRef = useRef(null);
  const stackRef = useRef(null);
  const techStackRef = useRef(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (total === 0) return;
    const first = mediaRefs.current[0];
    if (first) gsap.set(first, { opacity: 1, pointerEvents: "auto" });
  }, [project.id, total]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const lenis = lenisRefCtx?.current;
    if (lenis) lenis.stop();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setIndex(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      ).fromTo(galleryRef.current,
        { scale: 0.98 },
        { scale: 1, duration: 0.5, ease: "power3.out" },
        "-=0.15"
      );
    }, modalRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  useEffect(() => {
    const thumb = thumbStripRef.current?.children[index];
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  useEffect(() => {
    images.forEach((file, i) => {
      if (!isVideoFile(file)) return;
      const el = mediaRefs.current[i];
      if (!el) return;
      const video = el.querySelector("video");
      if (!video) return;
      if (i === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [index, images]);

  // Scroll-reveal animations using IntersectionObserver
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const revealEls = scrollEl.querySelectorAll("[data-reveal]");
    if (revealEls.length === 0) return;

    gsap.set(revealEls, { y: 28, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.stagger) {
            const items = el.querySelectorAll("[data-reveal-item]");
            if (items.length) {
              gsap.fromTo(items,
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 }
              );
            }
          } else {
            gsap.fromTo(el,
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
            );
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [project.id]);

  const animateTo = useCallback(
    (fromIdx, toIdx) => {
      if (transitioning.current || fromIdx === toIdx) return;
      transitioning.current = true;

      const fromEl = mediaRefs.current[fromIdx];
      const toEl = mediaRefs.current[toIdx];
      if (!fromEl || !toEl) {
        transitioning.current = false;
        return;
      }

      const direction = toIdx > fromIdx ? -1 : 1;

      gsap.set(toEl, { opacity: 0, pointerEvents: "none" });

      const tl = gsap.timeline({
        onComplete: () => {
          setIndex(toIdx);
          transitioning.current = false;
        },
      });

      tl.to(fromEl, {
        x: direction * 25 + "%",
        scale: 0.92,
        opacity: 0,
        duration: 0.45,
        ease: "power3.inOut",
      }, 0);

      tl.fromTo(
        toEl,
        { x: direction * -25 + "%", scale: 0.92, opacity: 0 },
        { x: "0%", scale: 1, opacity: 1, duration: 0.45, ease: "power3.inOut" },
        0
      );

      tl.set(fromEl, { pointerEvents: "none" }, "-=0.1");
      tl.set(toEl, { pointerEvents: "auto" }, "-=0.1");
    },
    []
  );

  const goNext = useCallback(() => {
    const i = indexRef.current;
    if (i >= total - 1) return;
    animateTo(i, i + 1);
  }, [total, animateTo]);

  const goPrev = useCallback(() => {
    const i = indexRef.current;
    if (i <= 0) return;
    animateTo(i, i - 1);
  }, [animateTo]);

  const goTo = useCallback(
    (i) => {
      if (i === indexRef.current || transitioning.current) return;
      animateTo(indexRef.current, i);
    },
    [animateTo]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  const handlePointerDown = (e) => {
    dragState.current.isDown = true;
    dragState.current.startX = e.clientX;
    dragState.current.moved = false;
  };

  const handlePointerMove = (e) => {
    if (!dragState.current.isDown) return;
    const diff = e.clientX - dragState.current.startX;
    if (Math.abs(diff) > 8) dragState.current.moved = true;
  };

  const handlePointerUp = (e) => {
    if (!dragState.current.isDown) return;
    const diff = e.clientX - dragState.current.startX;
    dragState.current.isDown = false;
    if (!dragState.current.moved) return;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
  };

  const scrollToSection = (key) => {
    const map = { overview: headerRef, stack: techStackRef, features: buildRef, build: stackRef };
    const el = map[key]?.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderMedia = (file, i) => {
    const url = getProjectImage(project.folder, file);
    return (
      <div className="flex items-center justify-center w-full h-full">
        {isVideoFile(file) ? (
          <video
            src={url}
            muted
            playsInline
            loop
            preload="metadata"
            className="w-full h-full object-contain pointer-events-none select-none"
            aria-label={`${project.title} video ${i + 1}`}
          />
        ) : (
          <img
            src={url}
            alt={`${project.title} screenshot ${i + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        )}
      </div>
    );
  };

  const hasSections = isSoftware;

  const renderMobileSplit = () => (
    <>
      <style>{`
        .mobile-split-grid {
          display: grid;
          grid-template-columns: minmax(340px, 42%) minmax(0, 58%);
          gap: clamp(40px, 5vw, 88px);
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          min-height: 100svh;
        }
        .split-media-col {
          position: sticky;
          top: 88px;
          align-self: start;
          height: calc(100svh - 120px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .split-media-col .thumb-strip::-webkit-scrollbar { display: none; }
        @media (max-width: 1100px) {
          .mobile-split-grid {
            grid-template-columns: minmax(280px, 38%) minmax(0, 62%);
            gap: clamp(24px, 3vw, 48px);
            padding: 0 16px;
          }
        }
        @media (max-width: 767px) {
          .mobile-split-grid { display: block; padding: 0 12px; }
          .split-media-col { position: static !important; height: auto !important; padding-top: 16px; }
        }
      `}</style>
      <div className="mobile-split-grid">
        <div className="split-media-col">
          <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden select-none rounded-xl"
            style={{ minHeight: 0, background: "#0B0B0B" }}
            onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp} onPointerLeave={() => { dragState.current.isDown = false; }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(500px circle at 50% 50%, rgba(${accentRgb}, 0.07), transparent 70%)` }} />
            {total > 0 ? images.map((file, i) => {
              const url = getProjectImage(project.folder, file);
              return (
                <div key={file} ref={(el) => (mediaRefs.current[i] = el)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none p-2">
                  <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden", background: "#0B0B0B", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
                    {isVideoFile(file) ? (
                      <video src={url} muted playsInline loop preload="metadata"
                        style={{ maxHeight: "calc(100svh - 250px)", maxWidth: "100%", width: "auto", height: "auto", objectFit: "contain", objectPosition: "center" }}
                        aria-label={`${project.title} video ${i + 1}`} />
                    ) : (
                      <img src={url} alt={`${project.title} screenshot ${i + 1}`}
                        style={{ maxHeight: "calc(100svh - 250px)", maxWidth: "100%", width: "auto", height: "auto", objectFit: "contain", objectPosition: "center" }}
                        draggable={false} />
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">No media available</div>
            )}
            {total > 1 && (
              <>
                <button onClick={goPrev} disabled={index === 0}
                  className="group absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 border disabled:opacity-20 disabled:cursor-default active:scale-[0.9]"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,0.08)", touchAction: "manipulation" }}>
                  <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
                </button>
                <button onClick={goNext} disabled={index >= total - 1}
                  className="group absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 border disabled:opacity-20 disabled:cursor-default active:scale-[0.9]"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,0.08)", touchAction: "manipulation" }}>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </button>
              </>
            )}
          </div>
          {total > 0 && (
            <div className="mt-3 text-xs tabular-nums select-none" style={{ color: "rgba(255,255,255,0.5)" }}>
              {index + 1} / {total}
            </div>
          )}
          {total > 1 && (
            <div ref={thumbStripRef} className="flex gap-2 py-3 overflow-x-auto thumb-strip">
              {images.map((file, i) => {
                const url = getProjectImage(project.folder, file);
                const isVid = isVideoFile(file);
                const isSelected = i === index;
                return (
                  <button key={file} onClick={() => goTo(i)}
                    className="shrink-0 h-[88px] md:h-[100px] rounded-lg overflow-hidden transition-all duration-200 relative"
                    style={{ opacity: isSelected ? 1 : 0.65, border: isSelected ? `2px solid ${accent}` : "2px solid transparent", boxShadow: isSelected ? `0 0 12px rgba(${accentRgb}, 0.15)` : "none" }}
                    aria-label={`Go to ${isVid ? "video" : "image"} ${i + 1}`}>
                    {isVid ? (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "#161616" }}>
                        <span className="text-white/30 text-xs">▶</span>
                      </div>
                    ) : (
                      <img src={url} alt="" className="w-full h-full object-contain" draggable={false} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="split-content-col" style={{ paddingTop: "clamp(20px, 3vw, 40px)", paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" }}>
          <div className="flex gap-1 pb-4 mb-6 overflow-x-auto"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {sectionLabels.map((s) => (
              <button key={s.key} onClick={() => scrollToSection(s.key)}
                className="shrink-0 text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                style={{ color: "rgba(255,255,255,0.4)", background: "transparent" }}>
                {s.label}
              </button>
            ))}
          </div>

          <div ref={headerRef} data-reveal>
            <StatusBadge status={project.status} />
            <div className="flex items-center gap-3 mt-4 mb-3">
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight" style={{ color: "#F5F5F5" }}>{project.title}</h2>
              <div className="w-0.5 h-6 md:h-8 shrink-0 self-center rounded-full" style={{ background: accent }} />
            </div>
            <p className="text-sm md:text-base leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.62)" }}>
              {project.description}
            </p>
          </div>

          {project.techStack && (
            <section ref={techStackRef} data-reveal className="mt-8">
              <SectionMarker index={1} label="Technology Stack" accent={accent} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-stagger>
                {Object.entries(project.techStack).map(([group, tags]) => {
                  const groupAccent = { Frontend: "#4F7CFF", Desktop: "#A78BFA", Backend: "#22C987", Database: "#D6A84F", "Architecture & Infrastructure": "#5BC0DE", Mobile: "#4F7CFF", Integration: "#A78BFA", "Backend Integration": "#22C987", Development: "#5BC0DE" }[group] || accent;
                  return (
                    <div key={group} data-reveal-item className="rounded-xl p-3 md:p-4 transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: "#121212", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: groupAccent }} />
                        <h4 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>{group}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full"
                            style={{ background: `rgba(${hexToRgb(groupAccent)}, 0.1)`, color: `rgba(255,255,255,0.6)` }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {project.whatIBuilt && (
            <section ref={overviewRef} data-reveal className="mt-8">
              <SectionMarker index={2} label="What I Built" accent={accent} />
              <div className="rounded-xl p-5 md:p-6" style={{ background: `rgba(${accentRgb}, 0.04)`, borderLeft: `2px solid ${accent}`, borderRadius: "12px" }}>
                <p className="text-sm md:text-base leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.72)" }}>{project.whatIBuilt}</p>
              </div>
            </section>
          )}

          {project.whyIBuiltIt && (
            <section ref={featuresRef} data-reveal className="mt-8">
              <SectionMarker index={3} label="Why I Built It" accent={accent} />
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10">
                <div className="shrink-0 md:w-[140px]">
                  <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>The Problem</div>
                </div>
                <div className="flex-1 max-w-[720px]">
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>{project.whyIBuiltIt}</p>
                </div>
              </div>
            </section>
          )}

          {project.includes?.length > 0 && (
            <section ref={buildRef} data-reveal className="mt-8">
              <SectionMarker index={4} label="Key Features" accent={accent} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-stagger>
                {project.includes.map((item) => (
                  <div key={item} data-reveal-item className="rounded-xl p-3 md:p-4 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                        style={{ background: `rgba(${accentRgb}, 0.12)`, color: accent }}>✓</span>
                      <span className="text-xs md:text-sm leading-snug" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.howIBuiltIt && (
            <section ref={stackRef} data-reveal className="mt-8">
              <SectionMarker index={5} label="How I Built It" accent={accent} />
              <div className="relative rounded-xl overflow-hidden" style={{ background: "#0E0E0E", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${accent}` }}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{ backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
                <div className="relative p-5 md:p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>Implementation</div>
                  <p className="text-sm md:text-base leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.72)" }}>{project.howIBuiltIt}</p>
                </div>
              </div>
            </section>
          )}

          {project.liveUrl && (
            <div data-reveal className="mt-8">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: `rgba(${accentRgb}, 0.1)`, color: accent, border: `1px solid rgba(${accentRgb}, 0.2)` }}>
                Visit Website ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50"
      style={{ background: "#080808", overflow: "hidden" }}
    >
      {/* Fixed top bar */}
      <div
        className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-3 md:px-5 py-2 md:py-4 pointer-events-none"
        style={{ paddingTop: "env(safe-area-inset-top, 8px)" }}
      >
        <button
          onClick={onClose}
          className="pointer-events-auto rounded-full bg-black/50 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white/80 hover:text-white transition border active:scale-[0.95]"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            touchAction: "manipulation",
          }}
          aria-label="Close project viewer"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          {total > 0 && (
            <span
              className="text-xs md:text-sm text-white/70 px-3 py-1 rounded-full tabular-nums select-none"
              style={{
                background: `rgba(${accentRgb}, 0.1)`,
                border: "1px solid rgba(255,255,255,0.06)",
                color: `rgba(255,255,255,0.75)`,
              }}
            >
              {index + 1} / {total}
            </span>
          )}

          <button
            onClick={onClose}
            className="pointer-events-auto rounded-full bg-black/50 backdrop-blur-md px-3 py-1.5 md:py-2 text-base md:text-lg text-white/80 hover:text-white transition border active:scale-[0.95]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              touchAction: "manipulation",
            }}
            aria-label="Close viewer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="project-detail-scroll"
        data-lenis-prevent
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehaviorY: "contain",
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isMobileSplit ? renderMobileSplit() : (
          <>
            {/* ===== MEDIA GALLERY ===== */}
        <div
          ref={galleryRef}
          className="relative w-full flex-shrink-0 z-20 pm-gallery"
          style={{
            height: "min(68svh, 620px)",
            minHeight: "360px",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => { dragState.current.isDown = false; }}
        >
          {total > 0 ? (
            <div
              className="relative w-full h-full overflow-hidden select-none"
              style={{ background: "#0B0B0B" }}
            >
              {/* Accent glow behind media */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at 50% 50%, rgba(${accentRgb}, 0.06), transparent 70%)`,
                }}
              />

              {/* Media items */}
              {images.map((file, i) => (
                <div
                  key={file}
                  ref={(el) => (mediaRefs.current[i] = el)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
                >
                  <div
                    className="flex items-center justify-center overflow-hidden"
                    style={{
                      width: "min(94vw, 1500px)",
                      height: "calc(100% - 32px)",
                      padding: "16px",
                    }}
                  >
                    {/* Frame border + shadow */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                        background: "#0B0B0B",
                      }}
                    >
                      {renderMedia(file, i)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom gradient */}
              <div
                className="absolute bottom-0 inset-x-0 h-16 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(to top, rgba(8,8,8,1), transparent)",
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
              No media available
            </div>
          )}

          {/* Nav arrows */}
          {total > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={index === 0}
                className="group absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 rounded-full w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 border disabled:opacity-20 disabled:cursor-default active:scale-[0.9]"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(255,255,255,0.08)",
                  touchAction: "manipulation",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.25)`;
                  e.currentTarget.style.boxShadow = `0 0 20px rgba(${accentRgb}, 0.08)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                aria-label="Previous image"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                  ←
                </span>
              </button>
              <button
                onClick={goNext}
                disabled={index >= total - 1}
                className="group absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 rounded-full w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 border disabled:opacity-20 disabled:cursor-default active:scale-[0.9]"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(255,255,255,0.08)",
                  touchAction: "manipulation",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.25)`;
                  e.currentTarget.style.boxShadow = `0 0 20px rgba(${accentRgb}, 0.08)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                aria-label="Next image"
              >
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  →
                </span>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div
            ref={thumbStripRef}
            className="flex gap-2 px-4 md:px-6 py-3 overflow-x-auto z-20 relative"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              background: "#080808",
            }}
          >
            {images.map((file, i) => {
              const url = getProjectImage(project.folder, file);
              const isVid = isVideoFile(file);
              const isSelected = i === index;
              return (
                <button
                  key={file}
                  onClick={() => goTo(i)}
                  className={`shrink-0 w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden transition-all duration-200 relative ${
                    isSelected ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    border: isSelected
                      ? `2px solid ${accent}`
                      : "2px solid transparent",
                    boxShadow: isSelected
                      ? `0 0 12px rgba(${accentRgb}, 0.15)`
                      : "none",
                  }}
                  aria-label={`Go to ${isVid ? "video" : "image"} ${i + 1}`}
                >
                  {isVid ? (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "#161616" }}
                    >
                      <span className="text-white/30 text-xs">▶</span>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Section navigation */}
        {hasSections && (
          <div
            className="flex gap-1 px-4 md:px-6 py-2 overflow-x-auto z-20 relative"
            style={{
              background: "#080808",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sectionLabels.map((s) => (
              <button
                key={s.key}
                onClick={() => scrollToSection(s.key)}
                className="shrink-0 text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = `rgba(255,255,255,0.8)`;
                  e.currentTarget.style.background = `rgba(255,255,255,0.04)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Desktop override */}
        <style>{`
          @media (min-width: 768px) {
            .pm-gallery {
              height: clamp(420px, 68vh, 900px) !important;
              min-height: 420px !important;
            }
          }
        `}</style>

        {/* ===== PROJECT INFO ===== */}
        <div
          ref={infoRef}
          className="z-20 relative"
          style={{
            background: "#080808",
            paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="px-5 md:px-10 py-8 md:py-12 max-w-[1200px] mx-auto">
            {/* === PROJECT HEADER === */}
            <div ref={headerRef} data-reveal>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-12">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <StatusBadge status={project.status} />
                  <div className="flex items-center gap-3 mt-4 mb-3">
                    <h2
                      className="text-2xl md:text-4xl font-semibold tracking-tight"
                      style={{ color: "#F5F5F5" }}
                    >
                      {project.title}
                    </h2>
                    <div
                      className="w-0.5 h-6 md:h-8 shrink-0 self-center rounded-full"
                      style={{ background: accent }}
                    />
                  </div>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-[700px]"
                    style={{ color: "rgba(255,255,255,0.62)" }}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Right */}
                <div className="shrink-0">
                  <div
                    className="rounded-xl p-4 md:p-5 min-w-[180px]"
                    style={{
                      background: "#111111",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="text-[10px] font-medium uppercase tracking-widest mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Project Type
                    </div>
                    <div className="text-xs font-medium mb-3"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {project.categoryLabel || project.category}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-widest mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Technologies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: `rgba(${accentRgb}, 0.08)`,
                            color: `rgba(255,255,255,0.55)`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SOFTWARE PROJECT SECTIONS ===== */}
            {isSoftware ? (
              <div className="mt-10 md:mt-14 space-y-14 md:space-y-20">

                {/* 01 — What I Built */}
                {project.whatIBuilt && (
                  <section ref={overviewRef} data-reveal>
                    <SectionMarker index={1} label="What I Built" accent={accent} />
                    <div
                      className="rounded-xl p-6 md:p-7"
                      style={{
                        background: `rgba(${accentRgb}, 0.04)`,
                        borderLeft: `2px solid ${accent}`,
                        borderRadius: "12px",
                      }}
                    >
                      <p
                        className="text-sm md:text-base leading-relaxed max-w-[720px]"
                        style={{ color: "rgba(255,255,255,0.72)" }}
                      >
                        {project.whatIBuilt}
                      </p>
                    </div>
                  </section>
                )}

                {/* 02 — Technology Stack */}
                {project.techStack && (
                  <section ref={techStackRef} data-reveal>
                    <SectionMarker index={2} label="Technology Stack" accent={accent} />
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                      data-stagger
                    >
                      {Object.entries(project.techStack).map(([group, tags]) => {
                        const groupAccent = {
                          Frontend: "#4F7CFF",
                          Desktop: "#A78BFA",
                          Backend: "#22C987",
                          Database: "#D6A84F",
                          "Architecture & Infrastructure": "#5BC0DE",
                          Mobile: "#4F7CFF",
                          Integration: "#A78BFA",
                          "Backend Integration": "#22C987",
                          Development: "#5BC0DE",
                        }[group] || accent;

                        return (
                          <div
                            key={group}
                            data-reveal-item
                            className="rounded-xl p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                              background: "#121212",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {/* Category header */}
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: groupAccent }}
                              />
                              <h4
                                className="text-[11px] font-semibold uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,0.5)" }}
                              >
                                {group}
                              </h4>
                            </div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] px-2.5 py-1 rounded-full"
                                  style={{
                                    background: `rgba(${hexToRgb(groupAccent)}, 0.1)`,
                                    color: `rgba(255,255,255,0.6)`,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 03 — Why I Built It */}
                {project.whyIBuiltIt && (
                  <section ref={featuresRef} data-reveal>
                    <SectionMarker index={3} label="Why I Built It" accent={accent} />
                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                      <div className="shrink-0 md:w-[140px]">
                        <div
                          className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                          style={{ color: accent }}
                        >
                          The Problem
                        </div>
                      </div>
                      <div className="flex-1 max-w-[720px]">
                        <p
                          className="text-sm md:text-base leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.72)" }}
                        >
                          {project.whyIBuiltIt}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* 04 — Key Features */}
                {project.includes?.length > 0 && (
                  <section ref={buildRef} data-reveal>
                    <SectionMarker index={4} label="Key Features" accent={accent} />
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                      data-stagger
                    >
                      {project.includes.map((item) => (
                        <div
                          key={item}
                          data-reveal-item
                          className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            background: "#111111",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                              style={{
                                background: `rgba(${accentRgb}, 0.12)`,
                                color: accent,
                              }}
                            >
                              ✓
                            </span>
                            <span
                              className="text-xs md:text-sm leading-snug"
                              style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                              {item}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 05 — How I Built It */}
                {project.howIBuiltIt && (
                  <section ref={stackRef} data-reveal>
                    <SectionMarker index={5} label="How I Built It" accent={accent} />

                    {/* Code-grid background */}
                    <div
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        background: "#0E0E0E",
                        border: `1px solid rgba(255,255,255,0.06)`,
                        borderTop: `2px solid ${accent}`,
                      }}
                    >
                      {/* Dot grid pattern */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                          backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`,
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="relative p-6 md:p-7">
                        <div
                          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                          style={{ color: accent }}
                        >
                          Implementation
                        </div>
                        <p
                          className="text-sm md:text-base leading-relaxed max-w-[720px]"
                          style={{ color: "rgba(255,255,255,0.72)" }}
                        >
                          {project.howIBuiltIt}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Visit Website */}
                {project.liveUrl && (
                  <div data-reveal>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: `rgba(${accentRgb}, 0.1)`,
                        color: accent,
                        border: `1px solid rgba(${accentRgb}, 0.2)`,
                        touchAction: "manipulation",
                      }}
                    >
                      Visit Website ↗
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* ===== WEBSITE PROJECT SECTIONS ===== */
              <div className="mt-10 space-y-8">
                <div data-reveal>
                  <SectionMarker index={1} label="Technology Stack" accent={accent} />
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1.5 rounded-full"
                        style={{
                          background: `rgba(${accentRgb}, 0.06)`,
                          color: "rgba(255,255,255,0.55)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.liveUrl && (
                  <div data-reveal>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: `rgba(${accentRgb}, 0.1)`,
                        color: accent,
                        border: `1px solid rgba(${accentRgb}, 0.2)`,
                        touchAction: "manipulation",
                      }}
                    >
                      Visit Website ↗
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
