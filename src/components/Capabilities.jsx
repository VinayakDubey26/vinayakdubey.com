import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { capabilities } from "../data/skills";

const Capabilities = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".cap-card", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-shell" aria-label="Capabilities">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="section-title mb-8 font-semibold">Capabilities</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {capabilities.map((item, idx) => (
            <article key={item.title} className="cap-card surface-card p-8" style={{ zIndex: 3 - idx }}>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight">{item.title}</h3>
              <p className="text-[var(--text-muted)]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
