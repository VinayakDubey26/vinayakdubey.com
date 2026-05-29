import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "./Button";

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
      });

      gsap.from(".hero-title, .hero-copy", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.4,
        ease: "power2.out",
      });

      gsap.from(".hero-portrait", {
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        delay: 0.8,
        stagger: 0.1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="section-shell min-h-screen subtle-gradient" aria-label="Hero">
      <div className="mx-auto grid min-h-[84vh] max-w-[1400px] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <h1 className="display-title mb-6 font-semibold">
            <span className="block overflow-hidden"><span className="hero-line block">Vinayak</span></span>
            <span className="block overflow-hidden"><span className="hero-line block">Dubey.</span></span>
          </h1>
          <h2 className="hero-title mb-6 text-xl font-medium tracking-tight md:text-3xl">Full-Stack Developer & Software Builder</h2>
          <p className="hero-copy max-w-2xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            I build business software, ecommerce platforms, and operational systems from concept to deployment.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="hero-cta"><Button href="#">Download Resume</Button></span>
            <span className="hero-cta"><Button href="#" variant="secondary">WhatsApp</Button></span>
          </div>
        </div>
        <div className="hero-portrait surface-card mx-auto w-full max-w-[440px] p-4 md:p-6">
          <div className="flex aspect-[4/5] items-center justify-center rounded-[18px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)]">
            <p className="text-center text-sm text-[var(--text-muted)]">Portrait Placeholder</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="h-10 w-6 rounded-full border border-[var(--border)] p-1">
          <div className="mx-auto h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
