import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollProvider } from "./context/ScrollContext";
import IntroHero from "./components/IntroHero";
import SkillsReveal from "./components/SkillsReveal";
import SelectedWork from "./components/SelectedWork";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ScrollProvider value={lenisRef}>
      <main>
        <IntroHero />
        <SkillsReveal />
        <div id="projects">
          <SelectedWork />
        </div>
      </main>
    </ScrollProvider>
  );
}

export default App;
