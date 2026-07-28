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
      className="flex min-h-svh items-center justify-center bg-[var(--bg)] px-5 md:px-[6vw]"
      aria-label="Intro"
    >
      <div className="relative w-full max-w-[1400px] text-center">
        <p className="intro-hi font-hero-display pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center text-[clamp(2rem,6vw,6.2rem)] font-medium leading-[1.04]">
          Hi
        </p>
        <h1 className="intro-main font-hero-display overflow-visible pt-[1.1em] text-[clamp(2rem,6vw,6.2rem)] font-semibold leading-[1.08] md:leading-[1.04]" style={{ textWrap: "balance" }}>
          I am Vinayak Dubey
        </h1>
      </div>
    </section>
  );
};

export default IntroHero;
