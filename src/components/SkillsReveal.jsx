import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILL_ICONS } from "../data/skillIcons";

const fullIntro = `I build software for businesses — ecommerce, AI tools, and operational systems.`;

const skillGroups = [
  { title: "Frontend", skills: ["React", "JavaScript", "HTML", "CSS", "GSAP", "Responsive Design"] },
  { title: "Backend", skills: ["Node.js", "Express.js", "REST APIs", "JWT", "OAuth"] },
  { title: "Databases", skills: ["SQLite", "PostgreSQL", "MySQL", "MongoDB", "Database Design"] },
  { title: "Cloud & Infrastructure", skills: ["AWS", "EC2", "S3", "RDS", "Deployment", "Security"] },
  { title: "AI Engineering", skills: ["GPT", "Claude", "Gemini", "RAG", "MCP", "AI Agents", "Embeddings"] },
  { title: "Automation", skills: ["n8n", "Zapier", "WhatsApp APIs", "Email APIs"] },
  { title: "Architecture", skills: ["System Design", "Cloud Architecture", "AI Architecture", "Database Architecture"] },
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
          trigger: introRef.current,
          start: TYPING_PARA,
          end: TYPING_END,
          scrub: true,
          onUpdate: (self) => {
            const progress = clamp(self.progress, 0, 1);

            // Background reaches full black as the intro paragraph settles
            // mid-screen, so the text is always readable where it appears.
            const dim = smoothstep(progress / FADE_IN_END);
            const dropT = clamp(progress / DROP_END, 0, 1);
            const easedDrop = dropT < 0.5
              ? 4 * dropT * dropT * dropT
              : 1 - Math.pow(-2 * dropT + 2, 3) / 2;

            setSceneBg(bgFromProgress(dim));
            setDropScale(easedDrop * 48);

            // Type as much as has scrolled into view.
            const visibleChars = Math.floor(progress * fullIntro.length);
            setDisplayedIntro(fullIntro.slice(0, visibleChars));
          },
        });

        // Reveal each skill group as its own card enters the viewport.
        const cells = sectionRef.current.querySelectorAll(".skill-cell");
        cells.forEach((cell, i) => {
          ScrollTrigger.create({
            trigger: cell,
            start: SKILL_ENTER,
            onEnter: () => setVisibleGroups(Math.min(skillGroups.length, i + 1)),
          });
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
    <section ref={sectionRef} id="about" className="skills-reveal relative min-h-svh overflow-hidden text-[#f5f5f7]" style={{ backgroundColor: sceneBg, scrollMarginTop: 0 }} aria-label="Skills Reveal">
      <div className="skills-pin relative flex min-h-svh items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[clamp(32px,8vw,120px)] w-[clamp(32px,8vw,120px)] rounded-full bg-[#050505]"
          style={{ transform: `translate(-50%, -50%) scale(${dropScale})` }}
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
            {displayedIntro}
            {showCursor && <span className="type-cursor">|</span>}
          </p>

          <div className="grid grid-cols-1 gap-x-[42px] gap-y-5 md:grid-cols-2 lg:grid-cols-3 md:gap-y-7">
            {skillGroups.map((group, idx) => {
              const isVisible = !animationReady || idx < visibleGroups;
              return (
                <div
                  key={group.title}
                  className="skill-cell border-b border-white/10 pb-5 md:pb-6"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    filter: isVisible ? "blur(0px)" : "blur(8px)",
                    transform: isVisible ? "translateY(0px)" : "translateY(12px)",
                    transition: "opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease",
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                >
                  <h3 className="mb-2 text-[clamp(0.94rem,1.1vw,1.15rem)] font-semibold tracking-[0.06em] text-[#f8f8f4]">{group.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {group.skills.map((skill) => {
                      const icon = SKILL_ICONS[skill];
                      return (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 text-[clamp(0.82rem,0.93vw,1rem)] leading-[1.55] text-[#e7e7e1]"
                        >
                          {icon && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={icon.color} aria-hidden="true">
                              <path d={icon.path} />
                            </svg>
                          )}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsReveal;
