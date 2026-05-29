const ProjectCard = ({ title, text }) => (
  <article className="surface-card-soft p-6 md:p-8">
    <h3 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
    <p className="text-sm leading-relaxed text-[var(--text-muted)] md:text-base">{text}</p>
  </article>
);

export default ProjectCard;
