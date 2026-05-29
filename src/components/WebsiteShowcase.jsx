import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WebsiteShowcase = ({ project }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".website-mockup",
        { scale: 0.95, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 40%",
            scrub: true,
          },
        },
      );

      gsap.from(".website-copy", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 72%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-shell" aria-label="Luxury Business Website">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="website-copy">
          <h2 className="section-title mb-4 font-semibold">{project.title}</h2>
          <p className="mb-6 max-w-xl text-lg text-[var(--text-muted)]">{project.subtitle}</p>
          <ul className="space-y-3">
            {project.details.map((item) => (
              <li key={item} className="text-base text-[var(--text-muted)]">{item}</li>
            ))}
          </ul>
        </div>
        <div className="website-mockup surface-card p-4 md:p-6">
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="mb-4 flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="aspect-[4/3] rounded-xl border border-[var(--border)]" />
              <div className="aspect-[4/3] rounded-xl border border-[var(--border)]" />
              <div className="aspect-[4/3] rounded-xl border border-[var(--border)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteShowcase;
