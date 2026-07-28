import Button from "./Button";

const Contact = () => (
  <section className="section-shell" aria-label="Contact">
    <div className="mx-auto max-w-[1400px]">
      <div className="surface-card p-6 md:p-14">
        <h2 className="section-title mb-4 max-w-3xl font-semibold text-[clamp(1.25rem,3vw,2.25rem)]">Have a project in mind? Let's build something useful.</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#">WhatsApp</Button>
          <Button href="#" variant="secondary">LinkedIn</Button>
          <Button href="#" variant="secondary">GitHub</Button>
          <Button href="mailto:your-email@example.com" variant="secondary">Email</Button>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
