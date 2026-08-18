import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollProvider } from "./context/ScrollContext";
import IntroHero from "./components/IntroHero";
import SkillsReveal from "./components/SkillsReveal";
import SelectedWork from "./components/SelectedWork";
import ContactSection from "./components/ContactSection";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ScrollProvider value={lenisRef}>
      <header className="fixed left-4 top-4 z-50 mix-blend-difference md:left-6 md:top-5">
        <button
          type="button"
          onClick={() => {
            const lenis = lenisRef.current;
            if (lenis) {
              lenis.scrollTo(0, { duration: 1.2 });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          aria-label="Back to top — vinayakdubey.com"
          className="cursor-pointer font-hero-display text-[0.82rem] font-semibold tracking-[0.03em] text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          vinayakdubey<span className="opacity-60">.com</span>
        </button>
      </header>
      <main>
        <IntroHero />
        <SkillsReveal />
        <div id="projects">
          <SelectedWork />
        </div>
        <ContactSection />
      </main>
    </ScrollProvider>
  );
}

export default App;
