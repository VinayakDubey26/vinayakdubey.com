import { useEffect, useRef, useState } from "react";
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

// The section fades from the hero's light tone to black while it slides into
// the viewport. Progress 0 -> 0.5 maps to the section's top traveling from
// 80% down the viewport to the very top, so the darkening stays in sync with
// its entry instead of snapping black instantly.
const FADE_IN_END = 0.5;
const DROP_END = 0.45;
const TEXT_START = 0.34;
const TEXT_RANGE = 0.32;
const SKILLS_START = 0.55;
const SKILLS_RANGE = 0.3;

const SkillsReveal = () => {
  const sectionRef = useRef(null);

  // Safe defaults: static final state unless animation initializes.
  const [animationReady, setAnimationReady] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState(fullIntro);
  const [visibleGroups, setVisibleGroups] = useState(skillGroups.length);
  const [sceneBg, setSceneBg] = useState("#050505");
  const [dropScale, setDropScale] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        setAnimationReady(true);
        setDisplayedIntro("");
        setVisibleGroups(0);
        setSceneBg("#f5f5f0");
        setDropScale(0);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
          onUpdate: (self) => {
            const progress = clamp(self.progress, 0, 1);

            // Background crossfades from light to black in sync with the
            // section entering the viewport.
            const dim = smoothstep(progress / FADE_IN_END);
            const dropT = clamp(progress / DROP_END, 0, 1);
            const easedDrop = dropT < 0.5
              ? 4 * dropT * dropT * dropT
              : 1 - Math.pow(-2 * dropT + 2, 3) / 2;

            setSceneBg(bgFromProgress(dim));
            setDropScale(easedDrop * 48);

            // Content only appears once the background is sufficiently dark.
            if (progress < TEXT_START) {
              setDisplayedIntro("");
              setVisibleGroups(0);
              return;
            }

            const typingProgress = clamp((progress - TEXT_START) / TEXT_RANGE, 0, 1);
            const visibleChars = Math.floor(typingProgress * fullIntro.length);
            setDisplayedIntro(fullIntro.slice(0, visibleChars));

            const skillProgress = clamp((progress - SKILLS_START) / SKILLS_RANGE, 0, 1);
            const groups = Math.ceil(skillProgress * skillGroups.length);
            setVisibleGroups(Math.min(skillGroups.length, Math.max(0, groups)));
          },
        });
      });

      return () => {
        ctx.revert();
      };
    } catch {
      // Fallback: keep initial state
    }
  }, []);

  const showCursor = animationReady && displayedIntro.length < fullIntro.length;

  return (
    <section ref={sectionRef} id="about" className="skills-reveal min-h-svh text-[#f5f5f7]" style={{ backgroundColor: sceneBg, scrollMarginTop: 0 }} aria-label="Skills Reveal">
      <div className="skills-pin relative flex min-h-svh items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[clamp(32px,8vw,120px)] w-[clamp(32px,8vw,120px)] rounded-full bg-[#050505]"
          style={{ transform: `translate(-50%, -50%) scale(${dropScale})` }}
          aria-hidden="true"
        />
        <div className="skills-content font-space relative z-[2] w-full max-w-[1150px] p-[clamp(20px,5vw,64px)] text-[#f5f5f7]">
          <p className="mb-[clamp(20px,4vh,48px)] whitespace-pre-wrap text-[clamp(1.25rem,2.6vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em]">
            {displayedIntro}
            {showCursor && <span className="type-cursor">|</span>}
          </p>

          <div className="grid grid-cols-1 gap-x-[42px] gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group, idx) => {
              const isVisible = !animationReady || idx < visibleGroups;
              return (
                <article
                  key={group.title}
                  className="transition-[opacity,filter,transform] duration-500 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    filter: isVisible ? "blur(0px)" : "blur(10px)",
                    transform: isVisible ? "translateY(0px)" : "translateY(12px)",
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                >
                  <h3 className="mb-2 text-[clamp(0.95rem,1.1vw,1.15rem)] font-semibold tracking-[0.04em] text-[#f8f8f4]">{group.title}</h3>
                  <p className="text-[clamp(0.82rem,0.95vw,1rem)] leading-[1.45] text-[#ecece8]">{group.text}</p>
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
