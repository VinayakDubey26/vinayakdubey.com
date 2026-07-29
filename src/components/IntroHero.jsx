import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenisRef } from "../context/ScrollContext";
import portraitSrc from "../assets/hero.png";

const IntroHero = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const labelRef = useRef(null);
  const nameRef = useRef(null);
  const scrollRef = useRef(null);
  const desktopPortraitRef = useRef(null);
  const mobilePortraitRef = useRef(null);
  const statementRef = useRef(null);
  const capsRef = useRef(null);
  const actionsRef = useRef(null);
  const lenisRef = useLenisRef();

  useLayoutEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const ctx = gsap.context(() => {
      if (mm.matches) {
        gsap.set(labelRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(nameRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(desktopPortraitRef.current, { autoAlpha: 1, x: "0%", scale: 1 });
        gsap.set(mobilePortraitRef.current, { autoAlpha: 1, x: "0%", scale: 1 });
        gsap.set(scrollRef.current, { autoAlpha: 0 });
        gsap.set(statementRef.current, { autoAlpha: 1, y: 0 });
        if (capsRef.current) gsap.set(Array.from(capsRef.current.children), { autoAlpha: 1, y: 0 });
        if (actionsRef.current) gsap.set(Array.from(actionsRef.current.children), { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const mobile = window.innerWidth < 768;
      const portraitEl = mobile ? mobilePortraitRef.current : desktopPortraitRef.current;
      const caps = capsRef.current ? Array.from(capsRef.current.children) : [];
      const btns = actionsRef.current ? Array.from(actionsRef.current.children) : [];

      gsap.set(btns, { autoAlpha: 0, y: 12 });

      const endValue = mobile ? "+=130%" : "+=220%";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: endValue,
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "power2.out" },
      });

      const p25 = 0.25;
      const p65 = 0.65;

      tl.to(labelRef.current, { autoAlpha: 1, y: 0, duration: 0.06 }, 0)
        .to(nameRef.current, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.02)
        .to(scrollRef.current, { autoAlpha: 1, duration: 0.05 }, 0.06)

        .to(labelRef.current, { autoAlpha: 0, duration: 0.05 }, p25 - 0.04)

        .to(portraitEl, { autoAlpha: 1, x: "0%", scale: 1, duration: 0.25 }, p25)
        .to(nameRef.current, {
          x: mobile ? "0%" : "-6%",
          y: "-4%",
          scale: mobile ? 1 : 0.72,
          duration: 0.2,
        }, p25 + 0.02)
        .to(stageRef.current, {
          backgroundColor: "#ecece7",
          duration: 0.12,
        }, p25 + 0.04)

        .to(scrollRef.current, { autoAlpha: 0, duration: 0.04 }, p65 - 0.04)
        .to(portraitEl, { scale: 0.94, duration: 0.06 }, p65 - 0.03)
        .to(nameRef.current, {
          x: mobile ? "0%" : "-10%",
          y: "-6%",
          scale: mobile ? 0.85 : 0.48,
          duration: 0.06,
        }, p65 - 0.02)
        .to(statementRef.current, { autoAlpha: 1, y: 0, duration: 0.08 }, p65)
        .to(caps, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.06 }, p65 + 0.07)
        .to(btns, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.06 }, p65 + 0.16);
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (selector) => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(selector);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="relative" aria-label="Hero">
      <div
        ref={stageRef}
        className="relative h-[100svh] w-full overflow-hidden bg-[#f5f5f0]"
        style={{ willChange: "background-color" }}
      >
        <div className="absolute inset-0 z-10 mx-auto flex max-w-[1440px] flex-col px-[clamp(20px,5vw,60px)] md:flex-row md:items-center max-md:pb-[40vh]">
          {/* TEXT CONTENT */}
          <div className="relative z-20 flex flex-1 flex-col justify-center pt-[clamp(40px,8vh,80px)] md:pt-0">
            <span
              ref={labelRef}
              className="font-hero-display mb-2 md:mb-3 block text-[clamp(0.55rem,0.7vw,0.75rem)] font-medium tracking-[0.18em] text-[#8b8b85]"
              style={{ opacity: 0, transform: "translateY(6px)" }}
            >
              FULL-STACK DEVELOPER &amp; SOFTWARE ENGINEER
            </span>
            <h1
              ref={nameRef}
              className="font-hero-display text-[clamp(2.4rem,10vw,10rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[#111111]"
              style={{ opacity: 0, transform: "translateY(20px)", textWrap: "balance" }}
            >
              I am Vinayak<br />Dubey
            </h1>
            <p
              ref={scrollRef}
              className="mt-[clamp(16px,4vh,48px)] text-[clamp(0.65rem,0.75vw,0.8rem)] font-medium tracking-[0.12em] text-[#8b8b85]"
              style={{ opacity: 0 }}
            >
              Scroll to explore
            </p>
          </div>

          {/* DESKTOP PORTRAIT */}
          <div
            ref={desktopPortraitRef}
            className="relative z-10 hidden flex-1 items-center justify-end md:flex"
            style={{ opacity: 0, transform: "translateX(18%) scale(1.06)" }}
          >
            <div className="relative w-full" style={{ height: "clamp(300px,70vh,85vh)" }}>
              <img
                src={portraitSrc}
                alt="Vinayak Dubey — Full-Stack Developer & Software Engineer"
                className="h-full w-full select-none object-contain object-right-bottom"
                draggable={false}
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#f5f5f0] to-transparent" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* MOBILE PORTRAIT */}
        <div
          ref={mobilePortraitRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] flex h-[40vh] items-end justify-center md:hidden"
          style={{ opacity: 0, transform: "translateY(10%) scale(1.06)" }}
        >
          <div className="relative h-full w-[80%] max-w-[320px]">
            <img
              src={portraitSrc}
              alt=""
              className="h-full w-full select-none object-contain object-bottom"
              draggable={false}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#f5f5f0] to-transparent" aria-hidden="true" />
          </div>
        </div>

        {/* FINAL STATE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center max-md:items-end max-md:pb-[12vh]">
          <div className="w-full max-w-[800px] px-[clamp(20px,5vw,60px)]">
            <p
              ref={statementRef}
              className="font-hero-display text-[clamp(1.3rem,3.2vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#111111]"
              style={{ opacity: 0, transform: "translateY(12px)" }}
            >
              I build business software,<br />
              ecommerce experiences,<br />
              and AI-powered systems.
            </p>
            <div
              ref={capsRef}
              className="mt-[clamp(14px,2.5vh,28px)] flex flex-wrap gap-x-[clamp(16px,2.5vw,32px)] gap-y-2"
            >
              <span className="text-[clamp(0.55rem,0.7vw,0.75rem)] font-semibold tracking-[0.16em] text-[#6f6f6f]" style={{ opacity: 0, transform: "translateY(8px)" }}>BUSINESS SOFTWARE</span>
              <span className="text-[clamp(0.55rem,0.7vw,0.75rem)] font-semibold tracking-[0.16em] text-[#6f6f6f]" style={{ opacity: 0, transform: "translateY(8px)" }}>WEB EXPERIENCES</span>
              <span className="text-[clamp(0.55rem,0.7vw,0.75rem)] font-semibold tracking-[0.16em] text-[#6f6f6f]" style={{ opacity: 0, transform: "translateY(8px)" }}>AI &amp; AUTOMATION</span>
            </div>
            <div
              ref={actionsRef}
              className="pointer-events-auto mt-[clamp(18px,3vh,36px)] flex flex-wrap gap-x-4 gap-y-3"
            >
              <button
                type="button"
                onClick={() => handleScrollTo("#projects")}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-[#111111] px-5 py-2.5 text-sm font-medium tracking-tight text-[#f5f5f0] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                View My Work &rarr;
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("#about")}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#d8d8d2] bg-transparent px-5 py-2.5 text-sm font-medium tracking-tight text-[#111111] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                About Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroHero;
