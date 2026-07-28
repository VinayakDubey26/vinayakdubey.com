import { buildingNow } from "../data/skills";

const BuildingNow = () => (
  <section className="section-shell" aria-label="Building Now">
    <div className="mx-auto max-w-[1400px]">
      <h2 className="section-title mb-6 max-w-5xl font-semibold text-[clamp(1.25rem,3vw,2.25rem)]">Currently building systems for businesses that need clarity, speed, and control.</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {buildingNow.map((item) => (
          <li key={item} className="surface-card-soft px-4 py-4 md:px-6 md:py-5 text-[clamp(0.875rem,1.2vw,1rem)] text-[var(--text-muted)]">{item}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default BuildingNow;
