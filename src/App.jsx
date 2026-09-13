import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollProvider } from "./context/ScrollContext";
import IntroHero from "./components/IntroHero";
import SkillsReveal from "./components/SkillsReveal";
import SelectedWork from "./components/SelectedWork";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Tuned for a buttery, non-floaty feel: eased duration + lighter
    // wheel/touch multipliers keep perceived speed natural while the
    // exponential easing avoids the "ice rink" feeling of raw lerp.
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.25,
      syncTouch: false,
      syncTouchLerp: 0.075,
      touchInertiaMultiplier: 35,
      infinite: false,
      autoRaf: false,
      anchors: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Child ScrollTriggers mount before this parent effect runs, so
    // force a refresh once Lenis is driving the ticker. Double rAF
    // ensures layout is settled, then also hook fonts + window load
    // so triggers measure against final sizes.
    const rafRefresh = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => ScrollTrigger.refresh())
      );
    rafRefresh();

    const onFontsReady = () => ScrollTrigger.refresh();
    const onWinLoad = () => ScrollTrigger.refresh();

    if (document.fonts?.ready) document.fonts.ready.then(onFontsReady);
    window.addEventListener("load", onWinLoad);

    return () => {
      window.removeEventListener("load", onWinLoad);
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
        <ServicesSection />
        <ContactSection />
      </main>
    </ScrollProvider>
  );
}

export default App;
