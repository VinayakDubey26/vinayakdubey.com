import { techStack } from "../data/skills";

const CATEGORIES = [
  { label: "Frontend engineering", description: "Interfaces that stay fast, readable, and considered.", skills: ["React", "JavaScript", "HTML", "CSS", "Vite"] },
  { label: "Backend & data", description: "Reliable foundations for the work behind the screen.", skills: ["Python", "FastAPI", "Django", "PostgreSQL", "SQL", "SQLite"] },
  { label: "AI & automation", description: "Practical intelligence where it improves the workflow.", skills: ["AI integrations", "Agents", "RAG", "Automation"] },
  { label: "Infrastructure & delivery", description: "Thoughtful systems from local development to launch.", skills: ["Git", "GitHub", "Docker", "Linux", "AWS", "Netlify"] },
];

const ExpertiseSection = () => (
  <section id="expertise" className="expertise-section section-light" aria-labelledby="expertise-heading">
    <div className="page-width"><div className="section-intro section-intro--split"><div><p className="eyebrow">Technical expertise</p><h2 id="expertise-heading">The details matter<br /><em>underneath.</em></h2></div><p className="section-intro__copy">A complete product needs more than a polished interface. These are the tools and practices I use to make ideas dependable in the real world.</p></div><div className="expertise-list">{CATEGORIES.map((category, index) => <article className="expertise-row" key={category.label}><span className="expertise-row__number">0{index + 1}</span><div><h3>{category.label}</h3><p>{category.description}</p></div><div className="expertise-row__skills">{category.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}</div><p className="expertise-note">Also in the toolkit: {techStack.filter((skill) => !CATEGORIES.some((category) => category.skills.includes(skill))).join(" · ")}</p></div>
  </section>
);

export default ExpertiseSection;
