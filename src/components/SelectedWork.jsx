import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectRow from "./ProjectRow";
import ProjectModal from "./ProjectModal";
import ErrorBoundary from "./ErrorBoundary";
import { websiteProjects, softwareProjects, mobileProjects } from "../data/projectsData";

gsap.registerPlugin(ScrollTrigger);

const SelectedWork = () => {
  const [modalProject, setModalProject] = useState(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  // Section intro animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      ).fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 lg:py-32 bg-[#050505] text-[#f5f5f7] overflow-hidden selected-work-section"
    >
      {/* Neighbor dimming */}
      <style>{`
        .scroll-row:hover .card-item:not(:hover) {
          opacity: 0.5;
          filter: brightness(0.6);
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
      `}</style>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Section intro */}
        <div className="px-6 md:px-10 mb-12 md:mb-16">
          <h2
            ref={titleRef}
            className="text-3xl md:text-5xl font-semibold tracking-tight"
          >
            PROJECTS
          </h2>
          <p
            ref={subtitleRef}
            className="mt-4 text-sm md:text-base text-white/40 max-w-[640px] leading-relaxed"
          >
            A selection of software platforms and web experiences I've designed
            and developed.
          </p>
        </div>

        <ProjectRow
          title="WEBSITES"
          projects={websiteProjects}
          onViewDetails={setModalProject}
        />

        <ProjectRow
          title="SOFTWARE"
          projects={softwareProjects}
          onViewDetails={setModalProject}
        />

        <ProjectRow
          title="MOBILE APPLICATION"
          projects={mobileProjects}
          onViewDetails={setModalProject}
        />
      </div>

      {modalProject && (
        <ErrorBoundary fallback={null}>
          <ProjectModal
            key={modalProject?.id || "modal"}
            project={modalProject}
            onClose={() => setModalProject(null)}
          />
        </ErrorBoundary>
      )}
    </section>
  );
};

export default SelectedWork;
