import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-services-reveal]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-16 text-[#f5f5f7] md:py-24 lg:py-32"
      aria-labelledby="services-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at 20% 20%, rgba(255,255,255,0.03), transparent 65%)",
        }}
        aria-hidden="true"
      />

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
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14"
        >
          {SERVICES.map((service) => (
            <a
              key={service.name}
              href="#contact"
              className="group flex min-h-[88px] items-center gap-4 rounded-xl border border-white/10 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-white/25 hover:bg-white/8"
            >
              <span>
                <span className="block text-sm font-semibold text-white/80 group-hover:text-white">
                  {service.name}
                </span>
                <span className="mt-1 block text-xs text-white/35">
                  {service.label}
                </span>
              </span>
              <span className="ml-auto text-white/35 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white/70">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
