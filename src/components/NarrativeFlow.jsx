import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const details = [
  "inventory systems",
  "billing architecture",
  "workflow automation",
  "reporting pipelines",
  "offline-first infrastructure",
];
const details2 = [
  "responsive systems",
  "headless commerce",
  "motion interfaces",
  "luxury ecommerce architecture",
  "conversion-focused UX",
];
const details3 = [
  "Prompt Engineering",
  "Automation Systems",
  "AI Integrations",
  "Operational Intelligence",
  "AI-assisted Development",
];
const fullTitle = "Operational Systems";
const fullTitle2 = "Commerce Experiences";
const fullTitle3 = "AI & Automation";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const mix = (a, b, t) => a + (b - a) * t;

const NarrativeFlow = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  // Safe fallback: static visible layout.
  const [animationReady, setAnimationReady] = useState(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    if (reduceMotion || mobile || !sectionRef.current || !pinRef.current) {
      setAnimationReady(false);
      setProgress(1);
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        setAnimationReady(true);
        setProgress(0);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=900",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            setProgress(clamp(self.progress, 0, 1));
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    } catch {
      setAnimationReady(false);
      setProgress(1);
    }
  }, []);

  const titleProgress = clamp(progress / 0.1, 0, 1);
  const detailsProgress = clamp((progress - 0.08) / 0.12, 0, 1);
  const settleProgress = clamp((progress - 0.2) / 0.12, 0, 1);
  const easedSettle = 1 - Math.pow(1 - settleProgress, 3);

  const blockLeft = mix(50, 12, easedSettle);
  const blockScale = mix(1, 0.72, easedSettle);
  const blockOpacity = mix(1, 0.72, easedSettle);
  const titleOpacity = titleProgress;
  const titleScale = mix(0.96, 1, titleProgress);
  const visibleTitleChars = Math.floor(titleProgress * fullTitle.length);
  const displayedTitle = fullTitle.slice(0, visibleTitleChars);
  const showCursor = animationReady && visibleTitleChars < fullTitle.length;

  const title2Progress = clamp((progress - 0.36) / 0.16, 0, 1);
  const details2Progress = clamp((progress - 0.48) / 0.16, 0, 1);
  const settle2Progress = clamp((progress - 0.7) / 0.2, 0, 1);
  const easedSettle2 = 1 - Math.pow(1 - settle2Progress, 3);

  const block2Left = progress < 0.7 ? 50 : mix(50, 88, easedSettle2);
  const block2Scale = progress < 0.7 ? 1 : mix(1, 0.72, easedSettle2);
  const block2Opacity = progress < 0.36 ? 0 : progress < 0.7 ? 1 : mix(1, 0.72, easedSettle2);
  const visibleTitle2Chars = Math.floor(title2Progress * fullTitle2.length);
  const displayedTitle2 = fullTitle2.slice(0, visibleTitle2Chars);
  const showCursor2 = animationReady && progress >= 0.36 && visibleTitle2Chars < fullTitle2.length;

  const title3Progress = clamp((progress - 0.76) / 0.12, 0, 1);
  const details3Progress = clamp((progress - 0.86) / 0.14, 0, 1);
  const settle3Progress = clamp((progress - 0.92) / 0.08, 0, 1);
  const easedSettle3 = 1 - Math.pow(1 - settle3Progress, 3);
  const visibleTitle3Chars = Math.floor(title3Progress * fullTitle3.length);
  const displayedTitle3 = fullTitle3.slice(0, visibleTitle3Chars);
  const showCursor3 = animationReady && progress >= 0.76 && visibleTitle3Chars < fullTitle3.length;
  const block3Scale = mix(1, 0.72, easedSettle3);
  const block3Opacity = progress < 0.76 ? 0 : mix(1, 0.72, easedSettle3);

  const sideDim = progress >= 0.76 ? 0.6 : 1;
  const block1VisibleOpacity = blockOpacity * sideDim;
  const block2VisibleOpacity = block2Opacity * sideDim;

  return (
    <section className="bg-[#050505] text-[#f5f5f7] h-[110vh]" ref={sectionRef} aria-label="Narrative Flow">
      <div className="relative h-screen min-h-screen overflow-hidden bg-[#050505]" ref={pinRef}>
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute left-[24%] top-1/2 h-[1px] w-[1px] -translate-x-1/2 -translate-y-1/2 opacity-0 narrative-slot narrative-slot-left" />
          <div className="absolute left-[50%] top-1/2 h-[1px] w-[1px] -translate-x-1/2 -translate-y-1/2 opacity-0 narrative-slot narrative-slot-center" />
          <div className="absolute left-[80%] top-1/2 h-[1px] w-[1px] -translate-x-1/2 -translate-y-1/2 opacity-0 narrative-slot narrative-slot-right" />
        </div>

        {!animationReady ? (
          <div className="mx-auto max-w-[1300px] px-5 py-[clamp(80px,10vw,140px)] md:px-[6vw]">
            <div className="grid gap-12 lg:grid-cols-3">
              <article>
                <h2 className="mb-4 text-[clamp(2rem,4vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.03em]">Operational Systems</h2>
                <ul className="space-y-2 text-[clamp(0.8rem,1vw,1rem)] uppercase tracking-[0.08em] text-white/78">
                  <li>inventory systems</li>
                  <li>billing architecture</li>
                  <li>workflow automation</li>
                  <li>reporting pipelines</li>
                  <li>offline-first infrastructure</li>
                </ul>
              </article>

              <article>
                <h2 className="mb-4 text-[clamp(2rem,4vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.03em]">Commerce Experiences</h2>
                <ul className="space-y-2 text-[clamp(0.8rem,1vw,1rem)] uppercase tracking-[0.08em] text-white/78">
                  <li>responsive systems</li>
                  <li>headless commerce</li>
                  <li>motion interfaces</li>
                  <li>luxury ecommerce architecture</li>
                  <li>conversion-focused UX</li>
                </ul>
              </article>

              <article>
                <h2 className="mb-4 text-[clamp(2rem,4vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.03em]">AI & Automation</h2>
                <ul className="space-y-2 text-[clamp(0.8rem,1vw,1rem)] uppercase tracking-[0.08em] text-white/78">
                  <li>prompt engineering</li>
                  <li>automation systems</li>
                  <li>AI integrations</li>
                  <li>operational intelligence</li>
                  <li>AI-assisted development</li>
                </ul>
              </article>
            </div>
          </div>
        ) : (
          <>
            <article
              className="absolute z-[2] w-[min(32vw,460px)]"
              style={{
                left: `${blockLeft}%`,
                top: "50%",
                transform: `translate(-50%, -50%) scale(${blockScale})`,
                opacity: block1VisibleOpacity,
              }}
            >
              <h2
                className="mb-[clamp(24px,4vh,42px)] text-[clamp(3.2rem,6vw,7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#f5f5f7]"
                style={{
                  opacity: titleOpacity,
                  transform: `scale(${titleScale})`,
                }}
              >
                {displayedTitle}
                {showCursor && <span className="type-cursor">|</span>}
              </h2>
              <ul className="space-y-4 text-[clamp(0.9rem,1.1vw,1.15rem)] uppercase tracking-[0.11em] leading-[1.75] text-white/65">
                {details.map((item, i) => {
                  const d = clamp((detailsProgress - i * 0.1) / 0.25, 0, 1);
                  return (
                    <li
                      key={item}
                      style={{
                        opacity: d,
                        transform: `translateY(${(1 - d) * 10}px)`,
                        filter: `blur(${(1 - d) * 6}px)`,
                      }}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </article>

            <article
              className="absolute z-[2] w-[min(48vw,720px)]"
              style={{
                left: `${block2Left}%`,
                top: "50%",
                transform: `translate(-50%, -50%) scale(${block2Scale})`,
                opacity: block2VisibleOpacity,
                pointerEvents: progress < 0.36 ? "none" : "auto",
              }}
            >
              <h2
                className="mb-[clamp(24px,4vh,42px)] text-[clamp(3.2rem,6vw,7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#f5f5f7]"
                style={{ opacity: title2Progress }}
              >
                {displayedTitle2}
                {showCursor2 && <span className="type-cursor">|</span>}
              </h2>
              <ul className="space-y-4 text-[clamp(0.9rem,1.1vw,1.15rem)] uppercase tracking-[0.11em] leading-[1.75] text-white/65">
                {details2.map((item, i) => {
                  const d = clamp((details2Progress - i * 0.1) / 0.25, 0, 1);
                  return (
                    <li
                      key={item}
                      style={{
                        opacity: d,
                        transform: `translateY(${(1 - d) * 10}px)`,
                      }}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </article>

            <article
              className="absolute z-[3] w-[min(48vw,720px)]"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) scale(${block3Scale})`,
                opacity: block3Opacity,
                pointerEvents: progress < 0.76 ? "none" : "auto",
              }}
            >
              <h2
                className="mb-[clamp(24px,4vh,42px)] text-[clamp(3.2rem,6vw,7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#f5f5f7]"
                style={{ opacity: title3Progress }}
              >
                {displayedTitle3}
                {showCursor3 && <span className="type-cursor">|</span>}
              </h2>
              <ul className="space-y-4 text-[clamp(0.9rem,1.1vw,1.15rem)] uppercase tracking-[0.11em] leading-[1.75] text-white/65">
                {details3.map((item, i) => {
                  const d = clamp((details3Progress - i * 0.1) / 0.25, 0, 1);
                  return (
                    <li
                      key={item}
                      style={{
                        opacity: d,
                        transform: `translateY(${(1 - d) * 10}px)`,
                      }}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </article>
          </>
        )}
      </div>
    </section>
  );
};

export default NarrativeFlow;
