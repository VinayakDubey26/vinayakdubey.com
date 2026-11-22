import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#expertise", label: "Expertise" },
  { href: "#about", label: "About" },
];

const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("work");
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const sections = LINKS.map(({ href }) => document.querySelector(href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0.1, 0.35, 0.65] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll("a, button");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("menu-open");
    requestAnimationFrame(() => menuRef.current?.querySelector("a")?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#top" aria-label="Vinayak Dubey home">
          <span className="site-nav__mark" aria-hidden="true">VD</span>
          <span>Vinayak Dubey</span>
        </a>
        <nav className="site-nav__links" aria-label="Primary navigation">
          {LINKS.map((link) => (
            <a key={link.href} className={active === link.href.slice(1) ? "is-active" : ""} href={link.href}>{link.label}</a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
        <button ref={menuButtonRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen((value) => !value)}>
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div ref={menuRef} id="mobile-navigation" className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <p className="eyebrow">Navigate</p>
          <nav aria-label="Mobile primary navigation">
            {LINKS.map((link, index) => (
              <a key={link.href} href={link.href} onClick={closeMenu}><span>0{index + 1}</span>{link.label}</a>
            ))}
            <a className="mobile-menu__cta" href="#contact" onClick={closeMenu}>Start a project <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteNav;
