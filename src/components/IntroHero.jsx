import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResumeLink from "./ResumeLink";
import { useLenisRef } from "../context/ScrollContext";

gsap.registerPlugin(ScrollTrigger);

const GREETINGS = [
  "Hello",
  "नमस्ते",
  "Bonjour",
  "Hola",
  "Ciao",
  "Hallo",
  "Olá",
  "こんにちは",
  "안녕하세요",
  "مرحبا",
];

const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    url: "https://wa.me/917021533178",
    ariaLabel: "Open WhatsApp",
    iconPath:
      "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    background: "#25D366",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/_vinayakdubey/",
    ariaLabel: "Open Instagram",
    iconPath:
      "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    background:
      "linear-gradient(135deg,#FEDA75 0%,#FA7E1E 25%,#D62976 50%,#962FBF 75%,#4F5BD5 100%)",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/vinayak-dubey-0b187a293/",
    ariaLabel: "Open LinkedIn",
    iconPath:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    background: "#0A66C2",
  },
  {
    name: "GitHub",
    url: "https://github.com/VinayakDubey26",
    ariaLabel: "Open GitHub",
    iconPath:
      "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
    background: "#181717",
  },
  {
    name: "Résumé",
    url: "",
    ariaLabel: "Open résumé",
    iconPath:
      "M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V4.125L16.5 1.5H5.625zM7.5 11.25h9a.75.75 0 010 1.5h-9a.75.75 0 010-1.5zm0 3.75h6a.75.75 0 010 1.5h-6a.75.75 0 010-1.5z",
    background: "#E5484D",
    hidden: true,
  },
];

const IntroHero = () => {
  const greetingRef = useRef(null);
  const greetingTextRef = useRef(null);
  const finalRef = useRef(null);
  const tlRef = useRef(null);
  const cueRef = useRef(null);
  const chevronRef = useRef(null);
  const circleRef = useRef(null);
  const heroNameRef = useRef(null);
  const heroSectionRef = useRef(null);
  const lenisRef = useLenisRef();

  useEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const greetingEl = greetingTextRef.current;
    const greetingContainer = greetingRef.current;
    const finalContent = finalRef.current;
    const heroName = heroNameRef.current;
    const cue = cueRef.current;

    if (!greetingEl || !greetingContainer || !finalContent) return;

    if (mm.matches) {
      gsap.set(greetingContainer, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
      return;
    }

    if (tlRef.current) {
      tlRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(greetingContainer, { visibility: "hidden", pointerEvents: "none" });
      },
    });

    tlRef.current = tl;

    const socialEls = finalContent.querySelectorAll(".hero-social-row > *");
    const hintEl = finalContent.querySelector(".hero-scroll-hint");

    gsap.set([heroName, socialEls, hintEl, cue], {
      autoAlpha: 0,
      y: 28,
    });

    greetingEl.textContent = GREETINGS[0];

    const hold = 0.08;
    const fadeOut = 0.07;
    const fadeIn = 0.08;

    tl.to({}, { duration: hold });

    for (let i = 1; i < GREETINGS.length; i++) {
      const idx = i;

      tl
        .to(greetingEl, {
          opacity: 0,
          y: -18,
          scale: 0.98,
          duration: fadeOut,
          ease: "power2.out",
          onComplete: () => {
            greetingEl.textContent = GREETINGS[idx];
            greetingEl.style.direction = idx === GREETINGS.length - 1 ? "rtl" : "";
          },
        })
        .set(greetingEl, { y: 18, scale: 1.02 })
        .to(greetingEl, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: fadeIn,
          ease: "power2.out",
        });

      if (i < GREETINGS.length - 1) {
        tl.to({}, { duration: hold });
      }
    }

    tl
      .to(greetingEl, {
        opacity: 0,
        y: -18,
        scale: 0.98,
        duration: 0.08,
        ease: "power2.out",
        onComplete: () => {
          greetingEl.innerHTML = "I am Vinayak Dubey";
          greetingEl.style.direction = "";
        },
      })
      .set(greetingEl, { y: 36, scale: 0.97 })
      .to(greetingEl, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
      })
      .to(heroName, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.35")
      .to(socialEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.out",
      }, "-=0.4")
      .to(hintEl, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.35")
      .to(cue, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      }, "-=0.3")
      .to(greetingContainer, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
      }, "+=0.35");

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const chevron = chevronRef.current;
    const circle = circleRef.current;
    const cue = cueRef.current;

    if (!chevron || !circle || !cue) return;

    const ctx = gsap.context(() => {
      if (mm.matches) {
        gsap.set(chevron, { y: 0, opacity: 0.8 });
        return;
      }

      gsap.to(chevron, {
        y: 7,
        opacity: 1,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      gsap.to(circle, {
        scale: 1.04,
        borderColor: "rgba(17,17,17,0.6)",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, cue);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const section = heroSectionRef.current;
    const name = heroNameRef.current;

    if (!section || !name || mm.matches) return;

    const ctx = gsap.context(() => {
      gsap.to(name, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo("#about", { offset: 0, duration: 1.6 });
      return;
    }
    const target = document.getElementById("about");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
  };

  const visibleLinks = SOCIAL_LINKS.filter((s) => !s.hidden);

  return (
    <section
      ref={heroSectionRef}
      className="hero relative bg-[#f5f5f0]"
      style={{
        minHeight: "100svh",
        display: "grid",
        alignContent: "center",
        overflow: "visible",
        padding: "clamp(56px, 8vh, 96px) 0 clamp(112px, 14vh, 150px)",
      }}
      aria-label="Hero"
    >
      <div
        ref={finalRef}
        className="z-0 overflow-visible"
        style={{
          width: "min(100%, 1440px)",
          marginInline: "auto",
          paddingInline: "clamp(24px, 8vw, 132px)",
        }}
      >
        <span className="font-hero-display mb-[18px] md:mb-[28px] block text-[clamp(0.78rem,1vw,1rem)] font-medium tracking-[0.06em] text-[#6f6f6f]">
          FULL-STACK DEVELOPER &amp; SOFTWARE ENGINEER
        </span>

        <h1
          ref={heroNameRef}
          className="hero-name font-hero-display text-[clamp(2.4rem,10vw,10rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[#111111]"
        >
          I am Vinayak<br />Dubey
        </h1>

        {visibleLinks.length > 0 && (
          <div
            className="hero-social-row flex items-center justify-start md:justify-end gap-[10px] md:gap-[14px] mt-7 w-full overflow-visible flex-wrap md:flex-nowrap md:pr-[clamp(12px,4vw,64px)]"
            style={{ minHeight: "58px" }}
          >
            {visibleLinks.map((s) => {
              const Tag = s.url ? "a" : "button";
              const extraProps = s.url
                ? { href: s.url, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Tag
                  key={s.name}
                  aria-label={s.ariaLabel}
                  className="flex w-[44px] md:w-[54px] h-[44px] md:h-[54px] min-w-[44px] md:min-w-[54px] flex-none items-center justify-center rounded-full transition-all duration-200 hover:scale-[1.08] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 active:scale-[0.96]"
                  style={{
                    background: s.background,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                  {...extraProps}
                >
                  <svg className="w-[22px] md:w-[25px] h-[22px] md:h-[25px]" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d={s.iconPath} />
                  </svg>
                </Tag>
              );
            })}

            <span className="hero-cta"><ResumeLink /></span>
          </div>
        )}

        <p className="hero-scroll-hint mt-7 text-[clamp(0.65rem,0.75vw,0.8rem)] font-medium tracking-[0.12em] text-[#8b8b85]">
          Scroll to explore
        </p>
      </div>

      <style>{`
@media (max-height: 800px) and (min-width: 769px) {
  .hero {
    align-content: start !important;
    padding-top: 56px !important;
    padding-bottom: 96px !important;
  }
  .hero-name {
    font-size: clamp(5rem, 9vw, 8rem) !important;
    line-height: 0.9 !important;
  }
  .hero-social-row {
    margin-top: 20px !important;
  }
}
`}</style>

      <div
        ref={greetingRef}
        className="absolute inset-0 z-10 flex items-center justify-center bg-[#f5f5f0] pointer-events-none"
      >
        <span
          ref={greetingTextRef}
          className="font-hero-display inline-block text-[clamp(3.5rem,9vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#111111] text-center"
          style={{
            maxWidth: "calc(100vw - 40px)",
            overflowWrap: "anywhere",
          }}
        >
          Hello
        </span>
      </div>

      <button
        ref={cueRef}
        type="button"
        aria-label="Continue to the next section"
        onClick={handleScrollDown}
        className="absolute z-20 grid cursor-pointer place-items-center rounded-full border-none transition-transform duration-75 hover:translate-y-0.5 active:scale-[0.94] focus-visible:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
        style={{
          width: "44px",
          height: "44px",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "clamp(24px, 4vh, 36px)",
          border: "1px solid rgba(17,17,17,0.38)",
          background: "rgba(255,255,255,0.35)",
          WebkitBackdropFilter: "blur(6px)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          ref={circleRef}
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(17,17,17,0.38)",
            background: "transparent",
          }}
        />
        <svg
          ref={chevronRef}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111111"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="relative"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </section>
  );
};

export default IntroHero;
