import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ShowcaseModal from "./ShowcaseModal";

const websites = [
  { title: "Luxury Boutique", description: "Immersive product experiences.", image: null },
  { title: "Modern Brand", description: "Story-led corporate website.", image: null },
];

const software = [
  { title: "Inventory Pro", description: "Offline-first inventory system.", image: null },
  { title: "Billing Suite", description: "Reliable billing and ledgers.", image: null },
];

const ExploreWork = () => {
  const [hovered, setHovered] = useState(null); // 'websites' | 'software' | null
  const [modal, setModal] = useState({ open: false, which: null, index: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setHovered(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openShowcase = (which, idx = 0) => {
    setModal({ open: true, which, index: idx });
  };

  const panelVariants = {
    idle: { flex: 1 },
    activeLeft: { flex: 7 },
    inactiveLeft: { flex: 3 },
    activeRight: { flex: 7 },
    inactiveRight: { flex: 3 },
  };

  return (
    <section className="w-full h-screen bg-[#050505] text-[#f5f5f7]" aria-label="Explore my work">
      <div className="h-full w-full">
        <div className="px-6 pt-8">
          <h2 className="text-[clamp(1.2rem,2.4vw,1.6rem)] font-semibold">EXPLORE MY WORK</h2>
        </div>

        <div className="flex h-[calc(100vh-72px)] md:h-[calc(100vh-64px)] sm:flex-col md:flex-row">
          {/* Left: Websites */}
          <motion.div
            role="button"
            aria-label="Explore Websites"
            initial="idle"
            animate={
              isTouch ? "idle" : hovered === "websites" ? "activeLeft" : hovered === "software" ? "inactiveLeft" : "idle"
            }
            variants={panelVariants}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onMouseEnter={() => !isTouch && setHovered("websites")}
            onMouseLeave={() => !isTouch && setHovered(null)}
            onTouchStart={() => setHovered("websites")}
            onClick={() => openShowcase("websites", 0)}
            className="relative overflow-hidden cursor-pointer flex items-end"
            style={{ minWidth: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" style={{ opacity: hovered === "software" ? 0.5 : 0.22 }} />

            <motion.div
              className="absolute inset-0 bg-[linear-gradient(135deg,#0b0b0c,#121214)] bg-cover bg-center"
              animate={{ scale: hovered === "websites" ? 1.03 : 1 }}
              transition={{ duration: 0.8 }}
              style={{ opacity: hovered === "websites" ? 0.35 : 0.08 }}
            />

            <div className="relative z-10 p-8 pb-12 md:pb-16 lg:pb-24">
              <div className="max-w-[56ch]">
                <h3 className={`uppercase font-semibold text-[clamp(2.8rem,8vw,6rem)] leading-tight`} style={{ opacity: hovered === "websites" ? 1 : 0.78 }}>
                  WEBSITES
                </h3>
                <p className="mt-4 text-white/70 text-sm">
                  Luxury Experiences
                  <br /> Business Websites
                  <br /> Ecommerce Platforms
                  <br /> Responsive Interfaces
                </p>
                <div className="mt-6 text-sm text-white/60">Click to explore →</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Software */}
          <motion.div
            role="button"
            aria-label="Explore Software"
            initial="idle"
            animate={
              isTouch ? "idle" : hovered === "software" ? "activeRight" : hovered === "websites" ? "inactiveRight" : "idle"
            }
            variants={panelVariants}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onMouseEnter={() => !isTouch && setHovered("software")}
            onMouseLeave={() => !isTouch && setHovered(null)}
            onTouchStart={() => setHovered("software")}
            onClick={() => openShowcase("software", 0)}
            className="relative overflow-hidden cursor-pointer flex items-end"
            style={{ minWidth: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" style={{ opacity: hovered === "websites" ? 0.5 : 0.22 }} />

            <motion.div
              className="absolute inset-0 bg-[linear-gradient(135deg,#081018,#0f0f12)] bg-cover bg-center"
              animate={{ scale: hovered === "software" ? 1.03 : 1 }}
              transition={{ duration: 0.8 }}
              style={{ opacity: hovered === "software" ? 0.35 : 0.08 }}
            />

            <div className="relative z-10 p-8 pb-12 md:pb-16 lg:pb-24 w-full text-right">
              <div className="max-w-[56ch] ml-auto">
                <h3 className={`uppercase font-semibold text-[clamp(2.8rem,8vw,6rem)] leading-tight`} style={{ opacity: hovered === "software" ? 1 : 0.78 }}>
                  SOFTWARE
                </h3>
                <p className="mt-4 text-white/70 text-sm">
                  Inventory Systems
                  <br /> Billing Platforms
                  <br /> Business Automation
                  <br /> Reporting Dashboards
                </p>
                <div className="mt-6 text-sm text-white/60">Click to explore →</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ShowcaseModal
        visible={modal.open && modal.which === "websites"}
        onClose={() => setModal({ open: false, which: null, index: 0 })}
        projects={websites}
        startIndex={modal.index}
        title="Websites"
      />

      <ShowcaseModal
        visible={modal.open && modal.which === "software"}
        onClose={() => setModal({ open: false, which: null, index: 0 })}
        projects={software}
        startIndex={modal.index}
        title="Software"
      />
    </section>
  );
};

export default ExploreWork;
