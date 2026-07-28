import ProjectCard from "./ProjectCard";

const ProjectRow = ({ title, projects, onViewDetails }) => (
  <div className="mb-14 md:mb-20">
    <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-5 px-6 md:px-10">
      {title}
    </h3>
    <div
      className="flex gap-4 md:gap-5 overflow-x-auto px-6 md:px-10 pb-4"
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  </div>
);

export default ProjectRow;
