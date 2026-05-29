import { techStack } from "../data/skills";

const TechStack = () => (
  <section className="section-shell" aria-label="Tech Stack">
    <div className="mx-auto max-w-[1400px]">
      <h2 className="section-title mb-8 font-semibold">Tech Stack</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {techStack.map((item) => (
          <div key={item} className="rounded-xl border border-[var(--border)] px-4 py-5 text-lg tracking-tight text-[var(--text-muted)]">
            {item}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStack;
