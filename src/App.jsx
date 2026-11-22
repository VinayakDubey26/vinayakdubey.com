import { useRef } from "react";
import { ScrollProvider } from "./context/ScrollContext";
import EditorialHero from "./components/EditorialHero";
import EditorialWork from "./components/EditorialWork";
import EditorialServices from "./components/EditorialServices";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

function App() {
  const scrollRef = useRef(null);

  return (
    <ScrollProvider value={scrollRef}>
      <main>
        <EditorialHero />
        <EditorialWork />
        <EditorialServices />
        <AboutSection />
        <ContactSection />
      </main>
    </ScrollProvider>
  );
}

export default App;
