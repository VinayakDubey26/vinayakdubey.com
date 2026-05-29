import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IntroHero from "./components/IntroHero";
import SkillsReveal from "./components/SkillsReveal";
import NarrativeFlow from "./components/NarrativeFlow";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <IntroHero />
      <SkillsReveal />
      <NarrativeFlow />
    </main>
  );
}

export default App;
