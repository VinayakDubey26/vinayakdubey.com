import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const fullIntro = `I am a Full-Stack Developer & Software Engineer.\n\nI build business software, ecommerce websites, AI-powered tools, and operational systems.`;

const skillGroups = [
  { title: "Frontend", text: "React • JavaScript • HTML • CSS • GSAP • Responsive Design" },
  { title: "Backend", text: "Node.js • Express.js • REST APIs • JWT • OAuth" },
  { title: "Databases", text: "SQLite • PostgreSQL • MySQL • MongoDB • Database Design" },
  { title: "Cloud & Infrastructure", text: "AWS • EC2 • S3 • RDS • Deployment • Security" },
  { title: "AI Engineering", text: "GPT • Claude • Gemini • RAG • MCP • AI Agents • Embeddings" },
  { title: "Automation", text: "n8n • Zapier • WhatsApp APIs • Email APIs" },
  { title: "Architecture", text: "System Design • Cloud Architecture • AI Architecture • Database Architecture" },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const mix = (a, b, t) => Math.round(a + (b - a) * t);
const smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const bgFromProgress = (t) => `rgb(${mix(245, 5, t)} ${mix(245, 5, t)} ${mix(240, 5, t)})`;

// All reveals are anchored to the content itself, not the section's top
// edge, so every text block appears as soon as its own part is scrolled into
// view on desktop and mobile alike:
//  - The background darkens and the intro types while the paragraph's top
//    travels from the bottom of the viewport to mid-screen (one consistent
//    window per device).
//  - Each skill group unhides when its own card first enters the screen.
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

    try {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        setAnimationReady(true);
        setVisibleGroups(0);

        // Direct DOM writes for per-frame values: avoids 60fps React re-renders.
        const sectionEl = sectionRef.current;
        const introTextEl = introTextRef.current;
        const dropEl = dropRef.current;
        const cursorEl = cursorRef.current;

        if (sectionEl) sectionEl.style.backgroundColor = "#f5f5f0";
        if (introTextEl) introTextEl.textContent = "";
        if (dropEl) dropEl.style.transform = "translate(-50%, -50%) scale(0)";
        if (cursorEl) cursorEl.style.opacity = "1";

        // Keep ScrollTrigger measurements valid after fonts/images settle.
        const refresh = () => ScrollTrigger.refresh();
        let rafId = 0;
        const scheduleRefresh = () => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => requestAnimationFrame(refresh));
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
          onRefresh: scheduleRefresh,
        });

        // Reveal each skill group as its own card enters the viewport.
        const cells = sectionRef.current.querySelectorAll(".skill-cell");
        // Ensure initial hidden state is set before ScrollTrigger measures.
        gsap.set(cells, { opacity: 0, filter: "blur(10px)", y: 12 });
        cells.forEach((cell, i) => {
          ScrollTrigger.create({
            trigger: cell,
            start: SKILL_ENTER,
            once: true,
            onEnter: () => {
              setVisibleGroups((prev) => Math.max(prev, i + 1));
              gsap.to(cell, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, ease: "power3.out", overwrite: true });
            },
          });
        });

        // One extra refresh after setup so start/end positions account for
        // the freshly-applied GSAP initial states and current scroll pos.
        scheduleRefresh();
      }, sectionRef);

      return () => ctx.revert();
    } catch {
      // Fallback: keep initial state
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
        <div className="skills-content font-space relative z-[2] w-full max-w-[1150px] p-[clamp(20px,5vw,64px)] text-[#f5f5f7]">
          <div className="mb-4 flex items-center justify-start md:mb-6">
            <span className="skill-pill inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#f5f5f0]/90 backdrop-blur-sm md:text-[0.68rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8d8d2] shadow-[0_0_12px_rgba(216,216,210,0.9)]" aria-hidden="true" />
              What I build
            </span>
          </div>

          <p ref={introRef} className="intro-copy mb-[clamp(20px,4vh,48px)] max-w-[980px] whitespace-pre-wrap text-[clamp(1.5rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#f8f8f4]">
            <span ref={introTextRef}>{fullIntro}</span>
            <span ref={cursorRef} className="type-cursor" style={{ opacity: animationReady ? 0 : 1 }}>|</span>
          </p>

          <div className="grid grid-cols-1 gap-x-[18px] gap-y-4 md:gap-x-[42px] md:gap-y-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="mb-2 text-[clamp(0.94rem,1.1vw,1.15rem)] font-semibold tracking-[0.06em] text-[#f8f8f4]">{group.title}</h3>
                  <p className="text-[clamp(0.82rem,0.93vw,1rem)] leading-[1.55] text-[#e7e7e1]">{group.text}</p>
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
