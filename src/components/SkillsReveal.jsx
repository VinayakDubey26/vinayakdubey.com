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
const bgFromProgress = (t) => `rgb(${mix(245, 5, t)} ${mix(245, 5, t)} ${mix(240, 5, t)})`;

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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setAnimationReady(false);
      setDisplayedIntro(fullIntro);
      setVisibleGroups(skillGroups.length);
      setSceneBg("#050505");
      setDropScale(0);
      return;
    }

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
          pin: true,
          start: "top top",
          end: "+=3400",
          scrub: true,
          onUpdate: (self) => {
            const progress = clamp(self.progress, 0, 1);

            const backgroundProgress = clamp(progress / 0.02, 0, 1);
            const dropProgress = clamp(progress / 0.28, 0, 1);
            const easedDrop = dropProgress < 0.5
              ? 4 * dropProgress * dropProgress * dropProgress
              : 1 - Math.pow(-2 * dropProgress + 2, 3) / 2;

            setSceneBg(bgFromProgress(backgroundProgress));
            setDropScale(easedDrop * 48);

            if (progress < 0.02) {
              setDisplayedIntro("");
              setVisibleGroups(0);
              return;
            }

            const typingProgress = clamp((progress - 0.02) / 0.4, 0, 1);
            const visibleChars = Math.floor(typingProgress * fullIntro.length);
            setDisplayedIntro(fullIntro.slice(0, visibleChars));

            const skillProgress = clamp((progress - 0.36) / 0.34, 0, 1);
            const groups = Math.ceil(skillProgress * skillGroups.length);
            setVisibleGroups(Math.min(skillGroups.length, Math.max(0, groups)));
          },
        });
      });

      return () => {
        ctx.revert();
      };
    } catch {
      setAnimationReady(false);
      setDisplayedIntro(fullIntro);
      setVisibleGroups(skillGroups.length);
      setSceneBg("#050505");
      setDropScale(0);
    }
  }, []);

  const showCursor = animationReady && displayedIntro.length < fullIntro.length;

  return (
    <section ref={sectionRef} className="skills-reveal -mt-[28vh] h-screen min-h-screen text-[#f5f5f7]" style={{ backgroundColor: sceneBg }} aria-label="Skills Reveal">
      <div className="skills-pin relative flex h-screen min-h-screen items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-[45%] z-0 h-[8vw] w-[8vw] rounded-full bg-[#050505]"
          style={{ transform: `translate(-50%, -50%) scale(${dropScale})` }}
          aria-hidden="true"
        />
        <div className="skills-content font-space relative z-[2] w-full max-w-[1150px] p-[clamp(24px,5vw,64px)] text-[#f5f5f7]">
          <p className="mb-[clamp(24px,4vh,48px)] whitespace-pre-wrap text-[clamp(1.5rem,2.6vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em]">
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
