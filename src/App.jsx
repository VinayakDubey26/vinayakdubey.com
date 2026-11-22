import { useRef } from "react";
import { ScrollProvider } from "./context/ScrollContext";
import SiteNav from "./components/SiteNav";
import EditorialHero from "./components/EditorialHero";
import EditorialWork from "./components/EditorialWork";
import EditorialServices from "./components/EditorialServices";
import ExpertiseSection from "./components/ExpertiseSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

function App() {
  const scrollRef = useRef(null);

  return (
    <ScrollProvider value={scrollRef}>
      <SiteNav />
      <main>
        <EditorialHero />
        <EditorialWork />
        <EditorialServices />
        <ExpertiseSection />
        <AboutSection />
        <ContactSection />
      </main>
    </ScrollProvider>
  );
}

export default App;
