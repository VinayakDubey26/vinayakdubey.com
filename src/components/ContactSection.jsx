import { useState } from "react";

const DIRECT_LINKS = [
  { name: "Email", href: "mailto:hello@vinayakdubey.com", label: "hello@vinayakdubey.com" },
  { name: "WhatsApp", href: "https://wa.me/917021533178", label: "Chat directly" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/vinayak-dubey-0b187a293/", label: "Connect professionally" },
  { name: "GitHub", href: "https://github.com/VinayakDubey26", label: "See the code" },
];

const PROJECT_TYPES = ["Business software", "Mobile app", "Ecommerce website", "Business website", "Operational system", "Something else"];
const inputClass = "contact-input";

const ContactSection = () => {
  const [status, setStatus] = useState("idle");
  const [projectType, setProjectType] = useState("");

  return (
    <>
      <section id="contact" className="contact-section section-dark" aria-labelledby="contact-heading">
        <div className="page-width"><div className="contact-grid"><div className="contact-copy"><p className="eyebrow">Start a conversation</p><h2 id="contact-heading">Have something<br /><em>in mind?</em></h2><p className="contact-copy__lead">Tell me what you&apos;re building, where the friction is, and what a useful outcome looks like. I&apos;ll get back to you with a thoughtful next step.</p><div className="direct-links">{DIRECT_LINKS.map((link) => <a key={link.name} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}><span><strong>{link.name}</strong><small>{link.label}</small></span><span aria-hidden="true">↗</span></a>)}</div></div>
          <form name="contact" method="POST" action="https://vinayakdubey.com/" acceptCharset="utf-8" data-netlify="true" netlify-honeypot="bot-field" onSubmit={() => setStatus("submitting")} className="contact-form">
            <input type="hidden" name="form-name" value="contact" />
            <p className="honeypot" aria-hidden="true"><label>Don&apos;t fill this out if you&apos;re human:<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="form-row"><label htmlFor="contact-name">Name<input className={inputClass} id="contact-name" name="name" type="text" required maxLength={80} placeholder="Your name" /></label><label htmlFor="contact-email">Email<input className={inputClass} id="contact-email" name="email" type="email" required maxLength={120} placeholder="you@example.com" /></label></div>
            <fieldset><legend>What do you want to build?</legend><div className="choice-list">{PROJECT_TYPES.map((type) => <label className={projectType === type ? "choice is-selected" : "choice"} key={type}><input type="radio" name="project-type" value={type} required checked={projectType === type} onChange={() => setProjectType(type)} />{type}</label>)}</div></fieldset>
            <label htmlFor="contact-message">Project details <span>(optional)</span><textarea className={inputClass} id="contact-message" name="message" rows="5" maxLength={2000} placeholder="Timeline, features, links, or anything else worth knowing..." /></label>
            <div className="form-submit"><button className="button button--light" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span></button><p role="status" aria-live="polite">{status === "submitting" ? "Opening the secure submission…" : "Usually replies within a few working days."}</p></div>
          </form>
        </div></div>
      </section>
      <footer className="site-footer"><div className="page-width site-footer__inner"><a className="site-nav__brand" href="#top"><span className="site-nav__mark" aria-hidden="true">VD</span><span>Vinayak Dubey</span></a><p>Full-stack developer &amp; software engineer</p><a href="mailto:hello@vinayakdubey.com">hello@vinayakdubey.com</a><span>© {new Date().getFullYear()} Vinayak Dubey</span></div></footer>
    </>
  );
};

export default ContactSection;
