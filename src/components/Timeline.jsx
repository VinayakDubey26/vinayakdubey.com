import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "../data/skills";

const Timeline = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );

      gsap.from(".timeline-item", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.14,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 68%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-shell" aria-label="Timeline">
      <div className="mx-auto max-w-4xl">
        <h2 className="section-title mb-10 font-semibold">Timeline</h2>
        <div className="relative pl-8">
          <span className="timeline-line absolute left-1 top-0 h-full w-[2px] bg-[var(--text)]" />
          <div className="space-y-8">
            {timeline.map((item) => (
              <article key={item.year} className="timeline-item relative">
                <span className="absolute -left-[30px] top-2 h-3 w-3 rounded-full border border-[var(--text)] bg-[var(--bg)]" />
                <h3 className="text-2xl font-semibold tracking-tight">{item.year}</h3>
                <p className="mt-1 text-[var(--text-muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
