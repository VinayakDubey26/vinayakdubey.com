import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SoftwareShowcase = ({ project }) => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray(".workflow-node");

      stages.forEach((node, i) => {
        ScrollTrigger.create({
          trigger: node,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(Math.min(i, project.stages.length - 1)),
          onEnterBack: () => setActive(Math.min(i, project.stages.length - 1)),
        });
      });

      gsap.from(".workflow-node", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [project.stages.length]);

  return (
    <section ref={sectionRef} className="section-shell" aria-label="Business Management Software">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="section-title mb-5 font-semibold">{project.title}</h2>
        <p className="mb-10 max-w-3xl text-lg text-[var(--text-muted)]">{project.subtitle}</p>

        <div className="mb-8 flex flex-wrap gap-3">
          {project.highlights.map((item) => (
            <span key={item} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)]">{item}</span>
          ))}
        </div>

        <div className="hidden gap-8 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card sticky top-20 h-fit p-8">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Current Stage</p>
            <h3 className="text-4xl font-semibold tracking-tight">{project.stages[active]}</h3>
            <div className="mt-8 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              {project.stages.map((_, idx) => (
                <span key={idx} className={`h-1.5 flex-1 rounded-full ${idx <= active ? "bg-[var(--text)]" : "bg-[var(--border)]"}`} />
              ))}
            </div>
          </div>

          <div className="surface-card p-8 md:p-10">
            <div className="space-y-7">
              {project.workflow.map((step, idx) => (
                <div key={step} className="workflow-node flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-sm">{idx + 1}</span>
                  <p className="text-2xl font-medium tracking-tight">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {project.stages.map((stage, idx) => (
            <article key={stage} className="surface-card-soft workflow-node p-6">
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Stage {idx + 1}</p>
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">{stage}</h3>
              <p className="text-sm text-[var(--text-muted)]">{project.features[idx] ?? project.features[project.features.length - 1]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwareShowcase;
