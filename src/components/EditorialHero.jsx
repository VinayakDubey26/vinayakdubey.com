import { useEffect, useState } from "react";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/VinayakDubey26" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vinayak-dubey-0b187a293/" },
  { label: "WhatsApp", href: "https://wa.me/917021533178" },
];

const EditorialHero = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="top" className={`editorial-hero ${ready ? "is-ready" : ""}`} aria-labelledby="hero-heading">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content page-width">
        <div className="hero-kicker reveal-item"><span className="status-dot" /><span>Independent software engineer</span><span className="hero-kicker__year">Based in India · 2026</span></div>
        <h1 id="hero-heading" className="hero-title reveal-item">
          <span className="hero-title__line"><span>I build software</span></span>
          <span className="hero-title__line"><span><em>that means business.</em></span></span>
        </h1>
        <div className="hero-lower reveal-item">
          <p className="hero-intro">I&apos;m Vinayak Dubey — a full-stack developer building custom business applications, ecommerce platforms, AI-powered tools, and operational systems.</p>
          <div className="hero-actions"><a className="button button--dark" href="#work">Explore my work <span aria-hidden="true">↘</span></a><a className="text-link" href="#contact">Start a project <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="hero-foot reveal-item"><div className="hero-socials" aria-label="Social links">{SOCIALS.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">{social.label}</a>)}</div><a className="scroll-cue" href="#work">Scroll to explore <span aria-hidden="true">↓</span></a></div>
      </div>
    </section>
  );
};

export default EditorialHero;
