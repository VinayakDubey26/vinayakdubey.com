import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
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

  const images = project.images || [];
  const total = images.length;
  const lenisRefCtx = useLenisRef();
  const isSoftware = !!project.techStack;
  const isMobileSplit = project.detailVariant === "mobile-split";

  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const galleryRef = useRef(null);
  const thumbStripRef = useRef(null);
  const mediaRefs = useRef([]);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const transitioning = useRef(false);
  const dragState = useRef({ isDown: false, startX: 0, moved: false });
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxRef = useRef(null);

  const headerRef = useRef(null);
  const techStackRef = useRef(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    lightboxRef.current = lightboxIndex;
  }, [lightboxIndex]);

  const closeLightbox = useCallback(() => {
    if (lightboxRef.current !== null && lightboxRef.current !== indexRef.current) {
      setIndex(lightboxRef.current);
    }
    setLightboxIndex(null);
  }, []);

  const openLightbox = (i) => {
    if (i == null) return;
    if (isVideoFile(images[i])) return;
    setLightboxIndex(i);
  };

  // Lock body + Lenis, show first media item immediately (no flash).
  useEffect(() => {
    const lenis = lenisRefCtx?.current;
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();

    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setIndex(0);

    // Make first image visible immediately, hide the rest.
    mediaRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === 0) {
        gsap.set(el, { opacity: 1, pointerEvents: "auto" });
      } else {
        gsap.set(el, { opacity: 0, pointerEvents: "none" });
      }
    });

    return () => {
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

  // Reveal detail sections on scroll — simple approach that always works.
  // Uses a single timeout-based reveal so content is visible even if
  // IntersectionObserver or Lenis scroll events are flaky.
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealEls = scrollEl.querySelectorAll("[data-reveal]");
    if (revealEls.length === 0) return;

    // Start hidden — will be revealed by observer or fallback timer.
    gsap.set(revealEls, { y: 24, opacity: 0 });
    gsap.set(scrollEl.querySelectorAll("[data-reveal-item]"), { y: 18, opacity: 0 });

    const reveal = (el) => {
      gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" });
      const items = el.querySelectorAll("[data-reveal-item]");
      if (items.length) {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.07,
          delay: 0.1,
        });
      }
    };

    // IntersectionObserver — fires when section scrolls into the modal viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          reveal(entry.target);
        });
      },
      { threshold: 0.05, root: scrollEl, rootMargin: "0px 0px 40px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));

    // Safety fallback: reveal everything after 1.5s regardless, so the
    // user always sees the content even if observer doesn't fire.
    const fallback = setTimeout(() => {
      revealEls.forEach((el) => {
        observer.unobserve(el);
        reveal(el);
      });
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
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
      if (e.key === "Escape") {
        if (lightboxRef.current !== null) {
          closeLightbox();
        } else {
          onClose();
        }
        return;
      }
      if (lightboxRef.current !== null) {
        if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % total);
        if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + total) % total);
        return;
      }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev, closeLightbox, total]);

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
    const map = { overview: headerRef, stack: techStackRef };
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
          grid-template-columns: minmax(280px, 42%) minmax(0, 58%);
          gap: clamp(24px, 4vw, 64px);
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          min-height: 100svh;
        }
        .split-media-col {
          position: sticky;
          top: 64px;
          align-self: start;
          height: calc(100svh - 96px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .split-media-col .thumb-strip::-webkit-scrollbar { display: none; }
        @media (max-width: 767px) {
          .mobile-split-grid { display: block; padding: 0 12px; }
          .split-media-col { position: static !important; height: auto !important; padding-top: 16px; }
          .split-media-stage { height: min(56svh, 400px) !important; flex: none !important; flex-shrink: 0 !important; }
          .split-media-stage img, .split-media-stage video { max-height: calc(min(56svh, 400px) - 16px) !important; }
        }
      `}</style>
      <div className="mobile-split-grid">
        <div className="split-media-col">
          <div className="split-media-stage relative w-full flex-1 flex items-center justify-center overflow-hidden select-none rounded-xl"
            style={{ minHeight: 0, background: "#0B0B0B" }}
            onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp} onPointerLeave={() => { dragState.current.isDown = false; }}
            onClick={(e) => {
              if (dragState.current.moved || e.target.closest("button")) return;
              openLightbox(index);
            }}
            title="Tap to view fullscreen">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(500px circle at 50% 50%, rgba(${accentRgb}, 0.07), transparent 70%)` }} />
            {total > 0 ? images.map((file, i) => {
              const url = getProjectImage(project.folder, file);
              return (
                <div key={file} ref={(el) => (mediaRefs.current[i] = el)}
                  className="absolute inset-0 flex items-center justify-center p-2"
                  style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}>
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

          <div ref={headerRef}>
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
            <section ref={techStackRef} className="mt-8">
              <SectionMarker index={1} label="Technology Stack" accent={accent} />
              <div className="max-w-[720px]">
                {Object.entries(project.techStack).map(([group, tags]) => (
                  <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest shrink-0 sm:w-[200px]" style={{ color: "rgba(255,255,255,0.5)" }}>{group}</h4>
                    <p className="text-xs md:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{tags.join("  ·  ")}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.whatIBuilt && (
            <section className="mt-8">
              <p className="text-base md:text-lg leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.78)" }}>{project.whatIBuilt}</p>
            </section>
          )}

          {project.whyIBuiltIt && (
            <section className="mt-8">
              <SectionMarker index={2} label="Why I Built It" accent={accent} />
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
            <section className="mt-8">
              <SectionMarker index={3} label="Key Features" accent={accent} />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 max-w-[720px]">
                {project.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 py-2.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="mt-0.5 text-xs font-bold shrink-0" style={{ color: accent }}>✓</span>
                    <span className="text-xs md:text-sm leading-snug" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.howIBuiltIt && (
            <section className="mt-8">
              <SectionMarker index={4} label="How I Built It" accent={accent} />
              <p className="text-sm md:text-base leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.72)" }}>{project.howIBuiltIt}</p>
            </section>
          )}

          {project.liveUrl && (
            <div className="mt-8">
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
      style={{ background: "#080808" }}
    >
      {/* Fixed top bar — always visible, z-30 above scroll content */}
      <div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-3 md:px-5 py-2 md:py-4"
        style={{ paddingTop: "env(safe-area-inset-top, 8px)" }}
      >
        <button
          onClick={onClose}
          className="rounded-full bg-black/60 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white/80 hover:text-white transition border active:scale-[0.95]"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
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
              }}
            >
              {index + 1} / {total}
            </span>
          )}

          <button
            onClick={onClose}
            className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 md:py-2 text-base md:text-lg text-white/80 hover:text-white transition border active:scale-[0.95]"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              touchAction: "manipulation",
            }}
            aria-label="Close viewer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Scroll container — NO data-lenis-prevent, native scroll works */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
        style={{
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
              className="relative w-full flex-shrink-0 z-20"
              style={{
                height: "min(68svh, 620px)",
                minHeight: "320px",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => { dragState.current.isDown = false; }}
              onClick={(e) => {
                if (dragState.current.moved || e.target.closest("button")) return;
                openLightbox(index);
              }}
              title="Tap to view fullscreen"
            >
              {total > 0 ? (
                <div
                  className="relative w-full h-full overflow-hidden select-none"
                  style={{ background: "#0B0B0B" }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(600px circle at 50% 50%, rgba(${accentRgb}, 0.06), transparent 70%)`,
                    }}
                  />

                  {images.map((file, i) => (
                    <div
                      key={file}
                      ref={(el) => (mediaRefs.current[i] = el)}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: i === 0 ? 1 : 0,
                        pointerEvents: i === 0 ? "auto" : "none",
                      }}
                    >
                      <div
                        className="flex items-center justify-center overflow-hidden"
                        style={{
                          width: "min(94vw, 1500px)",
                          height: "calc(100% - 32px)",
                          padding: "16px",
                        }}
                      >
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
                    aria-label="Previous image"
                  >
                    <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
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
                    aria-label="Next image"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
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
                        border: isSelected ? `2px solid ${accent}` : "2px solid transparent",
                        boxShadow: isSelected ? `0 0 12px rgba(${accentRgb}, 0.15)` : "none",
                      }}
                      aria-label={`Go to ${isVid ? "video" : "image"} ${i + 1}`}
                    >
                      {isVid ? (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "#161616" }}>
                          <span className="text-white/30 text-xs">▶</span>
                        </div>
                      ) : (
                        <img src={url} alt="" className="w-full h-full object-cover" draggable={false} />
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
                    className="shrink-0 text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors hover:text-white/80 hover:bg-white/4"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      background: "transparent",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Desktop gallery height */}
            <style>{`
              @media (min-width: 768px) {
                .pm-gallery { height: clamp(420px, 68vh, 900px) !important; min-height: 420px !important; }
              }
            `}</style>

            {/* ===== PROJECT INFO ===== */}
            <div
              className="z-20 relative"
              style={{
                background: "#080808",
                paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))",
              }}
            >
              <div className="px-5 md:px-10 py-8 md:py-12 max-w-[1200px] mx-auto">
                <div ref={headerRef}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-12">
                    <div className="flex-1 min-w-0">
                      <StatusBadge status={project.status} />
                      <div className="flex items-center gap-3 mt-4 mb-3">
                        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight" style={{ color: "#F5F5F5" }}>
                          {project.title}
                        </h2>
                        <div className="w-0.5 h-6 md:h-8 shrink-0 self-center rounded-full" style={{ background: accent }} />
                      </div>
                      <p className="text-sm md:text-base leading-relaxed max-w-[700px]" style={{ color: "rgba(255,255,255,0.62)" }}>
                        {project.description}
                      </p>
                    </div>

                    <div className="shrink-0 md:text-right">
                      <div className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Project Type
                      </div>
                      <div className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {project.categoryLabel || project.category}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Technologies
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {project.technologies?.slice(0, 4).join("  ·  ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Software project sections */}
                {isSoftware ? (
                  <div className="mt-10 md:mt-14 space-y-14 md:space-y-20">
                    {project.whatIBuilt && (
                      <section>
                        <p className="text-base md:text-lg leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.78)" }}>
                          {project.whatIBuilt}
                        </p>
                      </section>
                    )}

                    {project.techStack && (
                      <section ref={techStackRef}>
                        <SectionMarker index={1} label="Technology Stack" accent={accent} />
                        <div className="max-w-[720px]">
                          {Object.entries(project.techStack).map(([group, tags]) => (
                            <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              <h4 className="text-[11px] font-semibold uppercase tracking-widest shrink-0 sm:w-[220px]"
                                style={{ color: "rgba(255,255,255,0.5)" }}>
                                {group}
                              </h4>
                              <p className="text-xs md:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                                {tags.join("  ·  ")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {project.whyIBuiltIt && (
                      <section>
                        <SectionMarker index={2} label="Why I Built It" accent={accent} />
                        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                          <div className="shrink-0 md:w-[140px]">
                            <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>
                              The Problem
                            </div>
                          </div>
                          <div className="flex-1 max-w-[720px]">
                            <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                              {project.whyIBuiltIt}
                            </p>
                          </div>
                        </div>
                      </section>
                    )}

                    {project.includes?.length > 0 && (
                      <section>
                        <SectionMarker index={3} label="Key Features" accent={accent} />
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 max-w-[720px]">
                          {project.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 py-2.5"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              <span className="mt-0.5 text-xs font-bold shrink-0" style={{ color: accent }}>✓</span>
                              <span className="text-xs md:text-sm leading-snug" style={{ color: "rgba(255,255,255,0.7)" }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {project.howIBuiltIt && (
                      <section>
                        <SectionMarker index={4} label="How I Built It" accent={accent} />
                        <p className="text-sm md:text-base leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.72)" }}>
                          {project.howIBuiltIt}
                        </p>
                      </section>
                    )}

                    {project.liveUrl && (
                      <div>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            background: `rgba(${accentRgb}, 0.1)`,
                            color: accent,
                            border: `1px solid rgba(${accentRgb}, 0.2)`,
                            touchAction: "manipulation",
                          }}>
                          Visit Website ↗
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Website project sections */
                  <div className="mt-10 space-y-8">
                    <div>
                      <SectionMarker index={1} label="Technology Stack" accent={accent} />
                      <p className="text-xs md:text-sm leading-relaxed max-w-[720px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {project.technologies.join("  ·  ")}
                      </p>
                    </div>

                    {project.liveUrl && (
                      <div>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            background: `rgba(${accentRgb}, 0.1)`,
                            color: accent,
                            border: `1px solid rgba(${accentRgb}, 0.2)`,
                            touchAction: "manipulation",
                          }}>
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

      {/* Fullscreen image viewer */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ background: "rgba(4,4,4,0.97)", touchAction: "auto" }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} image fullscreen view`}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close fullscreen view"
            className="absolute top-0 right-0 z-10 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ width: "52px", height: "52px", background: "transparent", border: "none", fontSize: "28px", touchAction: "manipulation", paddingTop: "env(safe-area-inset-top, 8px)" }}
          >
            ×
          </button>

          <img
            src={getProjectImage(project.folder, images[lightboxIndex])}
            alt={`${project.title} screenshot ${lightboxIndex + 1} fullscreen`}
            className="max-w-full max-h-full w-auto h-auto object-contain select-none"
            draggable={false}
            style={{ touchAction: "auto", maxWidth: "calc(100vw - 16px)", maxHeight: "calc(100svh - 88px)" }}
            onClick={(e) => e.stopPropagation()}
          />

          {total > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLightboxIndex((i) => (i - 1 + total) % total)}
                aria-label="Previous image in fullscreen"
                className="rounded-full w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 border active:scale-[0.9]"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,0.12)", touchAction: "manipulation" }}
              >
                ←
              </button>
              <span className="text-xs tabular-nums text-white/50 select-none px-2">
                {lightboxIndex + 1} / {total}
              </span>
              <button
                onClick={() => setLightboxIndex((i) => (i + 1) % total)}
                aria-label="Next image in fullscreen"
                className="rounded-full w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 border active:scale-[0.9]"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,0.12)", touchAction: "manipulation" }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectModal;
