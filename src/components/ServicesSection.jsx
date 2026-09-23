import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    name: "Business Software",
    label: "Internal tools, dashboards, workflow systems",
  },
  {
    name: "Ecommerce Platforms",
    label: "Storefronts, inventory, order management",
  },
  {
    name: "Operational Systems",
    label: "Automations, trackers, custom CRMs",
  },
  {
    name: "Websites",
    label: "Portfolio sites, landing pages, brand sites",
  },
];

const ServicesSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-services-reveal]", { y: 28, opacity: 0 });
      gsap.to("[data-services-reveal]", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-16 text-[#f5f5f7] md:py-24 lg:py-32"
      aria-labelledby="services-heading"
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="max-w-[900px]">
          <p
            data-services-reveal
            className="text-xs font-semibold uppercase tracking-widest text-white/40"
          >
            Services
          </p>
          <h2
            id="services-heading"
            data-services-reveal
            className="font-hero-display mt-4 text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
          >
            Custom software,
            <br />
            built around how you
            <br />
            actually work.
          </h2>
          <p
            data-services-reveal
            className="mt-6 max-w-[560px] text-sm leading-relaxed text-white/50 md:text-base"
          >
            I build bespoke business software, ecommerce platforms, and
            operational tools for small teams — practical systems shaped around
            how you actually work, not templated solutions.
          </p>
        </div>

        <div
          data-services-reveal
          className="mt-12 lg:mt-16 border-t border-white/10 divide-y divide-white/10 max-w-[1200px]"
        >
          {SERVICES.map((service, idx) => (
            <a
              key={service.name}
              href="#contact"
              className="group py-6 md:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300 hover:bg-white/[0.02] px-2 -mx-2 rounded-lg"
            >
              <div className="flex items-baseline gap-4 sm:gap-8">
                <span className="text-xs font-mono font-semibold tracking-widest text-white/30">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white/90 group-hover:text-white transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-white/45 group-hover:text-white/60 transition-colors duration-200">
                    {service.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/40 group-hover:text-white transition-colors duration-200 self-end sm:self-center">
                <span>Start Project</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
