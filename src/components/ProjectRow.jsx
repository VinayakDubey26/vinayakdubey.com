import { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const ProjectRow = ({ title, projects, onViewDetails }) => {
  const scrollRef = useRef(null);
  const rowRef = useRef(null);
  const dragRef = useRef(false);
  const dragState = useRef({ isDown: false, startX: 0, startY: 0, scrollLeft: 0, moved: false, locked: false, vel: 0, raf: null });
  const [progress, setProgress] = useState(0);
  const staggerDone = useRef(false);

  useLayoutEffect(() => {
    const cards = rowRef.current?.querySelectorAll(".card-item");
    if (!cards?.length || staggerDone.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      staggerDone.current = true;
      return;
    }

    gsap.set(cards, { y: 40, opacity: 0 });

    let fallbackTimer = null;

    const reveal = () => {
      if (staggerDone.current) return;
      staggerDone.current = true;
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const st = ScrollTrigger.create({
      trigger: rowRef.current,
      start: "top 84%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: reveal,
    });

    fallbackTimer = window.setTimeout(() => {
      if (!staggerDone.current && ScrollTrigger.isInViewport(rowRef.current)) reveal();
    }, 900);
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));

    return () => {
      window.clearTimeout(fallbackTimer);
      st.kill();
    };
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!rowRef.current) return;
    const st = ScrollTrigger.create({
      trigger: rowRef.current,
      start: "top bottom",
      end: "bottom top",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const y = self.progress * -16 + 8;
        if (rowRef.current) rowRef.current.style.transform = `translateY(${y}px)`;
      },
    });

    return () => st.kill();
  }, []);

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const s = dragState.current;
    let watchdog = null;

    const resetDragState = () => {
      s.isDown = false;
      s.moved = false;
      s.locked = false;
      s.vel = 0;
      if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; }
      dragRef.current = false;
      if (watchdog) { clearTimeout(watchdog); watchdog = null; }
    };

    const onDown = (e) => {
      if (e.button !== 0 && e.button !== undefined) return;
      s.isDown = true;
      s.startX = e.pageX;
      s.startY = e.pageY;
      s.lastX = e.pageX;
      s.scrollLeft = el.scrollLeft;
      s.moved = false;
      s.locked = false;
      s.vel = 0;
      if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; }
      dragRef.current = false;
      watchdog = setTimeout(resetDragState, 3000);
    };

    const onMove = (e) => {
      if (!s.isDown) return;

      const dx = e.pageX - s.startX;
      const dy = e.pageY - s.startY;

      // On the first significant movement, decide the gesture direction.
      // If vertical movement dominates, this is a page scroll — bail out
      // entirely so Lenis / native scroll can take over.
      if (!s.locked) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDx < 8 && absDy < 8) return; // dead zone
        if (absDy > absDx) {
          // Vertical intent — release everything, let the page scroll.
          resetDragState();
          return;
        }
        s.locked = true; // horizontal intent confirmed
      }

      // Horizontal drag — prevent default so the browser doesn't also
      // try to scroll the page horizontally.
      e.preventDefault();

      const walk = dx;
      if (Math.abs(walk) > 3) s.moved = true;
      el.scrollLeft = s.scrollLeft - walk;
      s.vel = -(e.pageX - s.lastX);
      s.lastX = e.pageX;
      dragRef.current = s.moved;
      updateProgress();
      if (watchdog) { clearTimeout(watchdog); watchdog = setTimeout(resetDragState, 3000); }
    };

    const onUp = () => {
      if (!s.isDown) return;
      s.isDown = false;
      if (watchdog) { clearTimeout(watchdog); watchdog = null; }

      if (!s.locked) {
        // Gesture was vertical or too small — clean up.
        resetDragState();
        return;
      }

      // Momentum fling for horizontal drag
      const decay = 0.94;
      let v = Math.max(-30, Math.min(30, s.vel));

      const step = () => {
        if (Math.abs(v) < 0.3) { s.raf = null; resetDragState(); return; }
        if (!el) { s.raf = null; resetDragState(); return; }
        el.scrollLeft -= v;
        v *= decay;
        updateProgress();
        s.raf = requestAnimationFrame(step);
      };

      if (Math.abs(v) > 2) {
        s.raf = requestAnimationFrame(step);
      } else {
        resetDragState();
      }
    };

    const onLeave = () => {
      if (s.isDown) onUp();
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 0) return;
        const canScroll = e.deltaX > 0 ? el.scrollLeft < max - 1 : el.scrollLeft > 1;
        if (!canScroll) return;
        el.scrollLeft += e.deltaX;
        updateProgress();
        e.preventDefault();
      }
    };

    el.addEventListener("pointerdown", onDown, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onUp, { passive: true });
    el.addEventListener("pointercancel", resetDragState, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      if (watchdog) clearTimeout(watchdog);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", resetDragState);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", updateProgress);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.isDown = false;
      s.moved = false;
      s.locked = false;
      s.vel = 0;
      dragRef.current = false;
    };
  }, [updateProgress]);

  return (
    <div className="mb-14 md:mb-20" ref={rowRef}>
      <Reveal amount={0.4} y={16}>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-5 px-6 md:px-10">
          {title}
        </h3>
      </Reveal>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto px-6 md:px-10 pb-2 select-none scroll-row"
        data-lenis-prevent
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          touchAction: "pan-x pan-y",
          WebkitOverflowScrolling: "touch",
          cursor: "grab",
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
            dragRef={dragRef}
          />
        ))}
      </div>

      <div className="mt-3 md:mt-4 h-0.5 bg-white/8 rounded-full overflow-hidden mx-6 md:mx-10 max-w-[600px]">
        <div
          className="h-full bg-white/40 rounded-full transition-[width] duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProjectRow;
