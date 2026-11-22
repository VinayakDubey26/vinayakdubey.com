import { techStack } from "../data/skills";

const SERVICES = [
  {
    number: "01",
    title: "Business Software",
    accent: "cobalt",
    description: "Custom tools, dashboards, inventory systems, and business applications shaped around how a team actually works.",
    capabilities: "Operational systems, workflow automation, custom records, reporting, and connected internal tools.",
    technologies: ["React", "Python", "FastAPI", "PostgreSQL", "SQL", "SQLite"],
  },
  {
    number: "02",
    title: "Ecommerce Platforms",
    accent: "cobalt",
    description: "Distinctive storefronts and product experiences that make discovery feel effortless and give a brand room to grow.",
    capabilities: "Commerce journeys, product presentation, responsive storefronts, and conversion-aware interactions.",
    technologies: ["React", "JavaScript", "Shopify", "GSAP", "CSS"],
  },
  {
    number: "03",
    title: "AI & Automation",
    accent: "cobalt",
    description: "Practical AI integrations and automation patterns used where they make a process clearer, faster, or easier to operate.",
    capabilities: "AI-assisted tools, agents, retrieval patterns, and workflow automation grounded in a real business need.",
    technologies: ["AI integrations", "Agents", "RAG", "Automation", "Python"],
  },
  {
    number: "04",
    title: "Websites",
    accent: "cobalt",
    description: "Professional websites, portfolios, and business experiences with a clear point of view and dependable foundations.",
    capabilities: "Brand storytelling, responsive layouts, content structure, performance-minded builds, and interaction design.",
    technologies: ["React", "Vite", "HTML", "CSS", "GSAP"],
  },
];

const EditorialServices = () => (
  <section id="services" className="services-section section-light" aria-labelledby="services-heading">
    <div className="page-width">
      <div className="section-intro section-intro--split">
        <div>
          <p className="eyebrow">What I build</p>
          <h2 id="services-heading">What I build.<br /><em>How I build it.</em></h2>
        </div>
        <p className="section-intro__copy">I work across the interface, the data, and the architecture to turn real business friction into software people can rely on.</p>
      </div>

      <div className="service-grid" role="list">
        {SERVICES.map((service) => (
          <article className={`service-card service-card--${service.accent}`} key={service.number} role="listitem">
            <div className="service-card__top"><span className="service-card__number">{service.number}</span><span className="service-card__rule" aria-hidden="true" /></div>
            <h3>{service.title}</h3>
            <p className="service-card__description">{service.description}</p>
            <div className="service-card__capabilities"><p className="eyebrow">Capabilities</p><p>{service.capabilities}</p></div>
            <div className="service-card__foot">
              <ul className="service-card__tools" aria-label={`${service.title} technologies`}>
                {service.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
              <a className="service-card__action" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      </div>
      <p className="service-toolkit">Also in the toolkit: {techStack.filter((skill) => !SERVICES.some((service) => service.technologies.includes(skill))).join(" · ")}</p>
    </div>
  </section>
);

export default EditorialServices;
