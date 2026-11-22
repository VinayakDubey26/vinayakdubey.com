import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { websiteProjects, softwareProjects, mobileProjects, getProjectImage } from "../data/projectsData";
import ProjectModal from "./ProjectModal";
import ErrorBoundary from "./ErrorBoundary";

const groups = [
  { label: "Web experiences", kicker: "01 / Websites", projects: websiteProjects },
  { label: "Business systems", kicker: "02 / Software", projects: softwareProjects },
  { label: "Mobile products", kicker: "03 / Mobile", projects: mobileProjects },
];

const statusClass = (status = "Concept") => status.toLowerCase().replaceAll(" ", "-");

const ProjectTile = ({ project, featured, index, onOpen }) => {
  const image = getProjectImage(project.folder, project.images[0]);
  const reduceMotion = useReducedMotion();
  const imageMode = project.category === "mobile" ? "mobile" : project.category === "software" ? "software" : "website";
  return (
    <motion.article
      className={`work-tile ${featured ? "work-tile--featured" : ""}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.55, delay: reduceMotion ? 0 : Math.min(index * 0.07, 0.28), ease: [0.22, 1, 0.36, 1] }}
    >
      <button className={`work-tile__media work-tile__media--${imageMode}`} type="button" onClick={() => onOpen(project)} aria-label={`View details for ${project.title}`}>
        <img src={image} alt={`${project.title} project preview`} loading={featured ? "eager" : "lazy"} />
        <span className="work-tile__view">View project <span aria-hidden="true">↗</span></span>
      </button>
      <div className="work-tile__meta">
        <div><p className="work-tile__category">{project.categoryLabel || project.category}</p><h3>{project.title}</h3></div>
        <span className={`status-pill status-pill--${statusClass(project.status)}`}>{project.status}</span>
      </div>
      <p className="work-tile__description">{project.description}</p>
      <div className="work-tile__foot"><div className="tag-list">{project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}</div><div className="work-tile__actions"><button className="inline-arrow" type="button" onClick={() => onOpen(project)}>Details <span aria-hidden="true">↗</span></button>{project.liveUrl && <a className="inline-arrow" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live website`}>Visit website <span aria-hidden="true">↗</span></a>}</div></div>
    </motion.article>
  );
};

const EditorialWork = () => {
  const [modalProject, setModalProject] = useState(null);
  return (
    <section id="work" className="work-section section-light" aria-labelledby="work-heading">
      <div className="page-width">
        <div className="section-intro section-intro--split"><div><p className="eyebrow">Selected work</p><h2 id="work-heading">Systems with a point<br /><em>of view.</em></h2></div><p className="section-intro__copy">A selection of software platforms, ecommerce experiences, and operational tools designed and engineered from the ground up.</p></div>
        {groups.map((group) => {
          const isMobile = group.kicker.includes("Mobile");
          return <div className="work-group" key={group.kicker}><div className="work-group__heading"><p className="eyebrow">{group.kicker}</p><h3>{group.label}</h3></div><div className={`work-grid ${isMobile ? "work-grid--mobile" : ""}`}>{group.projects.map((project, index) => <ProjectTile key={project.id} project={project} index={index} featured={isMobile} onOpen={setModalProject} />)}</div></div>;
        })}
      </div>
      {modalProject && createPortal(<ErrorBoundary fallback={null}><ProjectModal key={modalProject.id} project={modalProject} onClose={() => setModalProject(null)} /></ErrorBoundary>, document.body)}
    </section>
  );
};

export default EditorialWork;
