import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILL_ICONS } from "../data/skillIcons";

const fullIntro = `I am a Full-Stack Developer & Software Engineer.\n\nI build business software, ecommerce websites, AI-powered tools, and operational systems.`;

const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "JavaScript", "HTML", "CSS", "GSAP", "Responsive Design"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT", "OAuth"],
  },
  {
    title: "Databases",
    items: ["SQLite", "PostgreSQL", "MySQL", "MongoDB", "Database Design"],
  },
  {
    title: "Cloud & Infrastructure",
    items: ["AWS", "EC2", "S3", "RDS", "Deployment", "Security"],
  },
  {
    title: "AI Engineering",
    items: ["GPT", "Claude", "Gemini", "RAG", "MCP", "AI Agents", "Embeddings"],
  },
  {
    title: "Automation",
    items: ["n8n", "Zapier", "WhatsApp APIs", "Email APIs"],
  },
  {
    title: "Architecture",
    items: ["System Design", "Cloud Architecture", "AI Architecture", "Database Architecture"],
  },
];

function SkillBadge({ name }) {
  const iconData = SKILL_ICONS[name];

  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-xs md:text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/[0.12] hover:text-white hover:scale-[1.02] select-none">
      {iconData && (
        <svg
          viewBox="0 0 24 24"
          className="h-4.5 w-4.5 md:h-5 md:w-5 shrink-0"
          fill={iconData.color || "currentColor"}
          aria-hidden="true"
        >
          <path d={iconData.path} />
        </svg>
      )}
      <span>{name}</span>
    </span>
  );
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const mix = (a, b, t) => Math.round(a + (b - a) * t);
const smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const bgFromProgress = (t) => `rgb(${mix(245, 5, t)} ${mix(245, 5, t)} ${mix(240, 5, t)})`;

const FADE_IN_END = 1;
const DROP_END = 0.55;
const TYPING_PARA = "top bottom";
const TYPING_END = "top 50%";
const SKILL_ENTER = "top 92%";

const SkillsReveal = () => {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const introTextRef = useRef(null);
  const cursorRef = useRef(null);
  const dropRef = useRef(null);

  // Safe defaults: static final state unless animation initializes.
  const [animationReady, setAnimationReady] = useState(false);
  const [visibleGroups, setVisibleGroups] = useState(skillGroups.length);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    try {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        setAnimationReady(true);

        const sectionEl = sectionRef.current;
        const introTextEl = introTextRef.current;
        const dropEl = dropRef.current;
        const cursorEl = cursorRef.current;
        const cells = sectionRef.current.querySelectorAll(".skill-cell");

        if (isMobile) {
          // On mobile: reveal text immediately & animate cards as soon as section enters view
          if (sectionEl) sectionEl.style.backgroundColor = "rgb(5 5 5)";
          if (introTextEl) introTextEl.textContent = fullIntro;
          if (cursorEl) cursorEl.style.opacity = "0";
          if (dropEl) dropEl.style.transform = "translate(-50%, -50%) scale(48)";
          setVisibleGroups(skillGroups.length);

          gsap.set(cells, { opacity: 0, y: 24, filter: "blur(0px)" });

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(cells, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power3.out",
                overwrite: true,
              });
            },
            onRefresh: (self) => {
              if (self.progress > 0 || sectionRef.current?.getBoundingClientRect().top < window.innerHeight) {
                gsap.to(cells, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
              }
            },
          });
          return;
        }

        // Desktop: smooth scrubbed intro & staggered card reveals
        setVisibleGroups(0);
        if (sectionEl) sectionEl.style.backgroundColor = "#f5f5f0";
        if (introTextEl) introTextEl.textContent = "";
        if (dropEl) dropEl.style.transform = "translate(-50%, -50%) scale(0)";
        if (cursorEl) cursorEl.style.opacity = "1";

        const refresh = () => ScrollTrigger.refresh();
        let rafId = 0;
        const scheduleRefresh = () => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => requestAnimationFrame(refresh));
        };

        const revealAll = () => {
          setVisibleGroups(skillGroups.length);
          if (introTextEl) introTextEl.textContent = fullIntro;
          if (cursorEl) cursorEl.style.opacity = "0";
          if (sectionEl) sectionEl.style.backgroundColor = bgFromProgress(1);
          if (cells) gsap.to(cells, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.4, overwrite: true });
        };

        ScrollTrigger.create({
          trigger: introRef.current,
          start: TYPING_PARA,
          end: TYPING_END,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = clamp(self.progress, 0, 1);
            const dim = smoothstep(progress / FADE_IN_END);
            const dropT = clamp(progress / DROP_END, 0, 1);
            const easedDrop = dropT < 0.5
              ? 4 * dropT * dropT * dropT
              : 1 - Math.pow(-2 * dropT + 2, 3) / 2;

            if (sectionEl) sectionEl.style.backgroundColor = bgFromProgress(dim);
            if (dropEl) dropEl.style.transform = `translate(-50%, -50%) scale(${easedDrop * 48})`;

            const visibleChars = Math.floor(progress * fullIntro.length);
            if (introTextEl) introTextEl.textContent = fullIntro.slice(0, visibleChars);
            if (cursorEl) cursorEl.style.opacity = visibleChars < fullIntro.length ? "1" : "0";
          },
          onLeave: () => {
            if (introTextEl) introTextEl.textContent = fullIntro;
            if (cursorEl) cursorEl.style.opacity = "0";
          },
          onRefresh: (self) => {
            if (self.progress >= 1) {
              if (introTextEl) introTextEl.textContent = fullIntro;
              if (cursorEl) cursorEl.style.opacity = "0";
            }
          },
          onRefreshInit: scheduleRefresh,
        });

        gsap.set(cells, { opacity: 0, filter: "blur(10px)", y: 12 });
        cells.forEach((cell, i) => {
          const revealCell = () => {
            setVisibleGroups((prev) => Math.max(prev, i + 1));
            gsap.to(cell, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.45, ease: "power3.out", overwrite: true });
          };

          ScrollTrigger.create({
            trigger: cell,
            start: "top 96%",
            once: true,
            onEnter: revealCell,
            onRefresh: (self) => {
              if (self.progress > 0 || cell.getBoundingClientRect().top < window.innerHeight * 0.96) {
                revealCell();
              }
            },
          });
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "bottom top",
          onEnter: revealAll,
          onLeaveBack: revealAll,
        });

        scheduleRefresh();
      }, sectionRef);

      return () => ctx.revert();
    } catch {
      // Fallback
    }
  }, []);

  return (
    <section ref={sectionRef} id="about" className="skills-reveal relative min-h-svh overflow-hidden text-[#f5f5f7]" style={{ backgroundColor: "#050505", scrollMarginTop: 0 }} aria-label="Skills Reveal">
      <div className="skills-pin relative flex min-h-svh items-center justify-center overflow-hidden">
        <div
          ref={dropRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[clamp(32px,8vw,120px)] w-[clamp(32px,8vw,120px)] rounded-full bg-[#050505] will-change-transform"
          style={{ transform: "translate(-50%, -50%) scale(0)" }}
          aria-hidden="true"
        />
        <div className="skills-content font-space relative z-[2] w-full max-w-[1450px] p-[clamp(20px,4vw,64px)] text-[#f5f5f7]">
          <div className="mb-4 flex items-center justify-start md:mb-6">
            <span className="skill-pill inline-flex items-center gap-2 rounded-full bg-[#121214] px-3.5 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#f5f5f0]/90 md:text-[0.68rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8d8d2]" aria-hidden="true" />
              What I build
            </span>
          </div>

          <p ref={introRef} className="intro-copy mb-[clamp(24px,5vh,56px)] max-w-[1100px] whitespace-pre-wrap text-[clamp(1.6rem,5vw,3.8rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#f8f8f4]">
            <span ref={introTextRef}>{fullIntro}</span>
            <span ref={cursorRef} className="type-cursor" style={{ opacity: animationReady ? 0 : 1 }}>|</span>
          </p>

          <div className="grid grid-cols-1 gap-x-[20px] gap-y-5 md:gap-x-[28px] md:gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group, idx) => {
              const isVisible = !animationReady || idx < visibleGroups;
              return (
                <article
                  key={group.title}
                  className="skill-cell will-change-transform"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    filter: isVisible ? "blur(0px)" : "blur(10px)",
                    transform: isVisible ? "translateY(0px)" : "translateY(12px)",
                    pointerEvents: isVisible ? "auto" : "none",
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
                  <h3 className="mb-3.5 text-xs md:text-sm font-semibold uppercase tracking-widest text-white/50">{group.title}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {group.items.map((item) => (
                      <SkillBadge key={item} name={item} />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsReveal;
