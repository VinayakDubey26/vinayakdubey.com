import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const ProjectRow = ({ title, projects, onViewDetails }) => {
  const scrollRef = useRef(null);
  const rowRef = useRef(null);
  const dragRef = useRef(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false, vel: 0, raf: null });
  const [progress, setProgress] = useState(0);
  const staggerDone = useRef(false);

  // Stagger animation on viewport entry
  useEffect(() => {
    const cards = rowRef.current?.querySelectorAll(".card-item");
    if (!cards?.length || staggerDone.current) return;

    gsap.set(cards, { y: 40, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: rowRef.current,
      start: "top 82%",
      once: true,
      onEnter: () => {
        staggerDone.current = true;
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    return () => st.kill();
  }, []);

  // Row parallax on scroll
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: rowRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const y = self.progress * -20 + 10;
        if (rowRef.current) rowRef.current.style.transform = `translateY(${y}px)`;
      },
    });

    return () => st.kill();
  }, []);

  // Update progress bar
  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  }, []);

  // Drag-to-scroll with momentum
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const s = dragState.current;

    const onDown = (e) => {
      s.isDown = true;
      s.startX = e.pageX - el.offsetLeft;
      s.scrollLeft = el.scrollLeft;
      s.moved = false;
      s.vel = 0;
      if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; }
      dragRef.current = false;
      el.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!s.isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - s.startX;
      if (Math.abs(walk) > 3) s.moved = true;
      el.scrollLeft = s.scrollLeft - walk;
      s.vel = walk;
      dragRef.current = s.moved;
      updateProgress();
    };

    const onUp = () => {
      if (!s.isDown) return;
      s.isDown = false;
      el.style.cursor = "grab";

      const decay = 0.96;
      let v = s.vel;

      const step = () => {
        if (Math.abs(v) < 0.3) { s.raf = null; return; }
        el.scrollLeft -= v;
        v *= decay;
        updateProgress();
        s.raf = requestAnimationFrame(step);
      };

      if (Math.abs(v) > 2) {
        s.raf = requestAnimationFrame(step);
      }
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaX;
        updateProgress();
        e.preventDefault();
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", updateProgress);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", updateProgress);
      if (s.raf) cancelAnimationFrame(s.raf);
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
        data-lenis-prevent
        className="flex gap-4 md:gap-5 overflow-x-auto px-6 md:px-10 pb-2 select-none scroll-row"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          touchAction: "auto",
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
