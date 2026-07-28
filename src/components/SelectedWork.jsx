import { useState } from "react";
import ProjectRow from "./ProjectRow";
import ProjectModal from "./ProjectModal";
import { websiteProjects, softwareProjects } from "../data/projectsData";

const SelectedWork = () => {
  const [modalProject, setModalProject] = useState(null);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#050505] text-[#f5f5f7]">
      <div className="max-w-[1600px] mx-auto">
        <div className="px-6 md:px-10 mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            PROJECTS
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/40 max-w-[640px] leading-relaxed">
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
      </div>

      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </section>
  );
};

export default SelectedWork;
