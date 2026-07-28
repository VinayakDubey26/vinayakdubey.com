import { getProjectImage } from "../data/projectsData";

const ProjectCard = ({ project, onViewDetails }) => {
  const hero = getProjectImage(project.folder, project.images[0]);
  const hasLiveUrl = !!project.liveUrl;
  const isPreview = !project.liveUrl && !project.images?.length;

  const handleCardClick = () => {
    onViewDetails(project);
  };

  const handleVisitWebsite = (e) => {
    e.stopPropagation();
    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails(project);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className="group relative w-[300px] h-[225px] md:w-[360px] md:h-[270px] lg:w-[440px] lg:h-[330px] shrink-0 rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer"
    >
      {/* Background screenshot */}
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${hero})` }}
      />

      {/* Strong bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 via-[#050505]/30 to-transparent" />

      {/* Category badge */}
      <span className="absolute top-3 left-3 rounded-full bg-[#050505]/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60 select-none">
        {project.categoryLabel}
      </span>

      {/* Content area */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 md:p-5">
        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold tracking-tight leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-[11px] md:text-xs text-white/50 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Impact */}
        <p className="mt-2 text-[11px] md:text-xs text-white/40 leading-relaxed italic line-clamp-1">
          {project.impact}
        </p>

        {/* Buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          {hasLiveUrl && (
            <button
              onClick={handleVisitWebsite}
              className="rounded-lg bg-white/10 px-3.5 py-1.5 text-[11px] font-medium transition hover:bg-white/16 active:scale-[0.97]"
            >
              Visit Website
            </button>
          )}
          <button
            onClick={handleViewDetails}
            className="rounded-lg border border-white/12 px-3.5 py-1.5 text-[11px] font-medium transition hover:bg-white/6 active:scale-[0.97]"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
