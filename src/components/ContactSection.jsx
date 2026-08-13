import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DIRECT_LINKS = [
  { name: "WhatsApp", href: "https://wa.me/917021533178", label: "Chat on WhatsApp" },
  { name: "Email", href: "mailto:hello@vinayakdubey.com", label: "hello@vinayakdubey.com" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/vinayak-dubey-0b187a293/", label: "Connect on LinkedIn" },
  { name: "GitHub", href: "https://github.com/VinayakDubey26", label: "View on GitHub" },
];

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f5f5f7] placeholder:text-white/30 transition-colors duration-200 focus:outline-none focus:border-white/30 focus:bg-white/8";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-contact-reveal]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("bot-field")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-[#050505] py-16 md:py-24 lg:py-32 text-[#f5f5f7]"
      aria-label="Contact"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at 80% 20%, rgba(255,255,255,0.03), transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p
              data-contact-reveal
              className="text-xs font-semibold uppercase tracking-widest text-white/40"
            >
              Contact
            </p>
            <h2
              data-contact-reveal
              className="font-hero-display mt-4 text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
            >
              Let&apos;s work
              <br />
              together.
            </h2>
            <p
              data-contact-reveal
              className="mt-6 max-w-[560px] text-sm md:text-base leading-relaxed text-white/50"
            >
              Have a project in mind — business software, an ecommerce platform,
              or an operational system? Tell me what you&apos;re building and
              I&apos;ll get back to you with how I can help.
            </p>

            <div data-contact-reveal className="mt-10 space-y-3">
              {DIRECT_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-white/25 hover:bg-white/8"
                >
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white">
                    {link.name}
                  </span>
                  <span className="hidden text-xs text-white/35 sm:block">
                    {link.label}
                  </span>
                  <span className="ml-auto text-white/35 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white/70">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            data-contact-reveal
            className="rounded-2xl border border-white/10 bg-white/4 p-6 md:p-10"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden" aria-hidden="true">
              <label>
                Don&apos;t fill this out if you&apos;re human:
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Your name"
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message" className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={2000}
                placeholder="Tell me about your project..."
                className={`${inputClasses} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 w-full rounded-xl bg-[#f5f5f7] px-6 py-3.5 text-sm font-semibold text-[#050505] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? "Sending..." : "Send message"}
            </button>

            <div role="status" aria-live="polite" className="mt-4 min-h-[1.5rem]">
              {status === "success" && (
                <p className="text-sm font-medium text-[#34d399]">
                  Thanks! Your message has been sent — I&apos;ll get back to you shortly.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm font-medium text-[#f87171]">
                  Something went wrong. Please try again, or reach me directly on WhatsApp.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
