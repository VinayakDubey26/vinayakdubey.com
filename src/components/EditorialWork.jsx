import { useState } from "react";
import { createPortal } from "react-dom";
import { websiteProjects, softwareProjects, mobileProjects, getProjectImage } from "../data/projectsData";
import ProjectModal from "./ProjectModal";
import ErrorBoundary from "./ErrorBoundary";

const groups = [
  { label: "Web experiences", kicker: "01 / Websites", projects: websiteProjects },
  { label: "Business systems", kicker: "02 / Software", projects: softwareProjects },
  { label: "Mobile products", kicker: "03 / Mobile", projects: mobileProjects },
];

const statusClass = (status = "Concept") => status.toLowerCase().replaceAll(" ", "-");

const ProjectTile = ({ project, featured, onOpen }) => {
  const image = getProjectImage(project.folder, project.images[0]);
  return (
    <article className={`work-tile ${featured ? "work-tile--featured" : ""}`}>
      <button className="work-tile__media" type="button" onClick={() => onOpen(project)} aria-label={`View details for ${project.title}`}>
        <img src={image} alt={`${project.title} project preview`} loading={featured ? "eager" : "lazy"} />
        <span className="work-tile__view">View project <span aria-hidden="true">↗</span></span>
      </button>
      <div className="work-tile__meta">
        <div><p className="work-tile__category">{project.categoryLabel || project.category}</p><h3>{project.title}</h3></div>
        <span className={`status-pill status-pill--${statusClass(project.status)}`}>{project.status}</span>
      </div>
      <p className="work-tile__description">{project.description}</p>
      <div className="work-tile__foot"><div className="tag-list">{project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}</div><button className="inline-arrow" type="button" onClick={() => onOpen(project)}>Details <span aria-hidden="true">↗</span></button></div>
    </article>
  );
};

const EditorialWork = () => {
  const [modalProject, setModalProject] = useState(null);
  const featured = softwareProjects[0];

  return (
    <section id="work" className="work-section section-light" aria-labelledby="work-heading">
      <div className="page-width">
        <div className="section-intro section-intro--split"><div><p className="eyebrow">Selected work</p><h2 id="work-heading">Systems with a point<br /><em>of view.</em></h2></div><p className="section-intro__copy">A selection of software platforms, ecommerce experiences, and operational tools designed and engineered from the ground up.</p></div>
        <div className="featured-project"><div className="featured-project__image"><img src={getProjectImage(featured.folder, featured.images[0])} alt={`${featured.title} dashboard preview`} loading="eager" /><span className="featured-project__index">Featured / 01</span></div><div className="featured-project__body"><div><p className="eyebrow">{featured.categoryLabel}</p><h3>{featured.title}</h3><p>{featured.description}</p></div><div className="featured-project__details"><p>{featured.impact}</p><div className="tag-list">{featured.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><button className="button button--dark" type="button" onClick={() => setModalProject(featured)}>Open case study <span aria-hidden="true">↗</span></button></div></div></div>
        {groups.map((group) => <div className="work-group" key={group.kicker}><div className="work-group__heading"><p className="eyebrow">{group.kicker}</p><h3>{group.label}</h3></div><div className="work-grid">{group.projects.filter((project) => project.id !== featured.id).map((project) => <ProjectTile key={project.id} project={project} onOpen={setModalProject} />)}</div></div>)}
      </div>
      {modalProject && createPortal(<ErrorBoundary fallback={null}><ProjectModal key={modalProject.id} project={modalProject} onClose={() => setModalProject(null)} /></ErrorBoundary>, document.body)}
    </section>
  );
};

export default EditorialWork;
