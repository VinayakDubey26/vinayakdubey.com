import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollProvider } from "./context/ScrollContext";
import EditorialHero from "./components/EditorialHero";
import EditorialWork from "./components/EditorialWork";
import EditorialServices from "./components/EditorialServices";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

const THEME_STORAGE_KEY = "vinayak-theme";

const getInitialTheme = () => {
  if (typeof document !== "undefined" && (document.documentElement.dataset.theme === "dark" || document.documentElement.dataset.theme === "light")) {
    return document.documentElement.dataset.theme;
  }

  return "dark";
};

const persistTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
};

const readStoredTheme = () => {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

function App() {
  const scrollRef = useRef(null);
  const themeToggleRef = useRef(null);
  const initialTheme = getInitialTheme();
  const themeRef = useRef(initialTheme);
  const themeTransitionRef = useRef(false);
  const [theme, setTheme] = useState(initialTheme);
  const [themeTransitioning, setThemeTransitioning] = useState(false);

  useEffect(() => {
    themeRef.current = theme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#14161B" : "#F5F2EA");
  }, [theme]);

  useEffect(() => {
    const storedTheme = readStoredTheme();

    if (storedTheme === "dark" || storedTheme === "light") return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = (event) => {
      const nextTheme = event.matches ? "dark" : "light";
      themeRef.current = nextTheme;
      setTheme(nextTheme);
    };

    mediaQuery.addEventListener?.("change", onSystemThemeChange);
    return () => mediaQuery.removeEventListener?.("change", onSystemThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    if (themeTransitionRef.current) return;

    const nextTheme = themeRef.current === "dark" ? "light" : "dark";
    const toggleElement = themeToggleRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const applyTheme = () => {
      themeRef.current = nextTheme;
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      setTheme(nextTheme);
      persistTheme(nextTheme);
    };

    if (!toggleElement || reducedMotion || typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const rect = toggleElement.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(originX, window.innerWidth - originX), Math.max(originY, window.innerHeight - originY));
    const root = document.documentElement;

    root.style.setProperty("--theme-origin-x", `${originX}px`);
    root.style.setProperty("--theme-origin-y", `${originY}px`);
    root.style.setProperty("--theme-reveal-radius", `${radius}px`);
    themeTransitionRef.current = true;
    setThemeTransitioning(true);

    let transition;
    try {
      transition = document.startViewTransition(applyTheme);
    } catch {
      applyTheme();
      themeTransitionRef.current = false;
      setThemeTransitioning(false);
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      root.style.removeProperty("--theme-reveal-radius");
      return;
    }

    transition.finished.catch(() => undefined).finally(() => {
      themeTransitionRef.current = false;
      setThemeTransitioning(false);
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      root.style.removeProperty("--theme-reveal-radius");
    });
  }, []);

  return (
    <ScrollProvider value={scrollRef}>
      <main>
        <EditorialHero theme={theme} onToggleTheme={toggleTheme} themeToggleRef={themeToggleRef} themeTransitioning={themeTransitioning} />
        <EditorialWork />
        <EditorialServices />
        <AboutSection />
        <ContactSection />
      </main>
    </ScrollProvider>
  );
}

export default App;
