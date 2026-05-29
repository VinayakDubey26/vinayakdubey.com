const SystemsSection = () => {
  return (
    <section className="bg-[#050505] text-[#f5f5f7] min-h-screen" aria-label="Engineering Modern Business Systems">
      <div className="mx-auto max-w-[1400px] px-5 py-[clamp(90px,12vw,170px)] md:px-[6vw]">
        <h2 className="mb-[clamp(56px,8vh,110px)] text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Engineering Modern Business Systems
        </h2>

        <div className="space-y-[clamp(110px,16vh,240px)]">
          <article className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-5 text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">Business Software</h3>
              <p className="mb-6 max-w-[700px] text-base leading-relaxed text-white/78 md:text-lg">
                Offline-first operational systems engineered for inventory management, billing workflows, ledger tracking, reporting, inspection pipelines, and scalable business operations.
              </p>
              <ul className="space-y-2 text-sm tracking-[0.01em] text-white/76 md:text-base">
                <li>Inventory Systems</li>
                <li>Billing Engines</li>
                <li>Ledger Architecture</li>
                <li>Workflow Automation</li>
                <li>Reporting Systems</li>
                <li>Offline-first Infrastructure</li>
              </ul>
            </div>
          </article>

          <article className="grid items-center gap-12 lg:grid-cols-2">
            <div className="lg:order-2">
              <h3 className="mb-5 text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">Ecommerce Experiences</h3>
              <p className="mb-6 max-w-[700px] text-base leading-relaxed text-white/78 md:text-lg">
                Luxury-focused ecommerce platforms designed with immersive motion, responsive architecture, modern frontend systems, and premium user experiences.
              </p>
              <ul className="space-y-2 text-sm tracking-[0.01em] text-white/76 md:text-base">
                <li>Premium Frontend Architecture</li>
                <li>Responsive UI Systems</li>
                <li>Shopify & Headless Commerce</li>
                <li>Motion-driven Interfaces</li>
                <li>Conversion-focused UX</li>
              </ul>
            </div>
          </article>

          <article className="mx-auto max-w-[1200px] text-center">
            <h3 className="mb-5 text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">AI & Automation</h3>
            <p className="mx-auto mb-6 max-w-[700px] text-base leading-relaxed text-white/78 md:text-lg">
              AI-assisted systems, automation workflows, prompt-driven tooling, and operational intelligence engineered to simplify modern digital workflows.
            </p>
            <ul className="space-y-2 text-sm tracking-[0.01em] text-white/76 md:text-base">
              <li>AI Integrations</li>
              <li>Prompt Engineering</li>
              <li>Workflow Automation</li>
              <li>AI-assisted Development</li>
              <li>Operational Intelligence</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default SystemsSection;
