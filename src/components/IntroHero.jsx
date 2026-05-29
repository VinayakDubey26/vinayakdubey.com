import { useEffect, useRef } from "react";
import gsap from "gsap";

const IntroHero = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".intro-hi",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.75 },
      )
        .to(".intro-hi", {
          autoAlpha: 0,
          y: -20,
          duration: 0.65,
          delay: 0.35,
        })
        .fromTo(
          ".intro-main",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
        );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="h-screen min-h-screen bg-[var(--bg)] px-5 md:px-[6vw]"
      aria-label="Intro"
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-center overflow-visible">
        <div className="relative w-full overflow-visible text-center">
          <p className="intro-hi font-hero-display pointer-events-none absolute inset-0 flex items-center justify-center pb-2 text-[clamp(2.8rem,6vw,6.2rem)] font-medium leading-[1.04]">
            Hi
          </p>
          <h1 className="intro-main font-hero-display overflow-visible whitespace-normal pb-6 text-[clamp(2.8rem,6vw,6.2rem)] font-semibold leading-[1.04] md:whitespace-nowrap">
            I am Vinayak Dubey
          </h1>
        </div>
      </div>
    </section>
  );
};

export default IntroHero;


