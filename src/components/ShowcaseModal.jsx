import { useEffect, useState } from "react";

const ShowcaseModal = ({ visible, onClose, projects = [], startIndex = 0, title = "Showcase" }) => {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % projects.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible, projects.length, onClose]);

  if (!visible) return null;

  const prev = () => setIndex((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setIndex((i) => (i + 1) % projects.length);

  const p = projects[index] || { title: "Untitled", description: "", image: null };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-6 right-6 z-60 rounded-sm bg-white/6 px-3 py-2 text-sm backdrop-blur-sm hover:bg-white/10 transition"
      >
        Close
      </button>

      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-6 top-1/2 z-60 -translate-y-1/2 rounded-full bg-white/6 p-3 backdrop-blur-sm hover:bg-white/10 transition"
      >
        ‹
      </button>

      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-6 top-1/2 z-60 -translate-y-1/2 rounded-full bg-white/6 p-3 backdrop-blur-sm hover:bg-white/10 transition"
      >
        ›
      </button>

      <div className="mx-auto max-w-[1400px] w-full px-6">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7 flex items-center">
            <div className="w-full overflow-hidden rounded-md bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-lg">
              {/* Image / preview */}
              <div
                className="h-[60vh] bg-cover bg-center"
                style={{ backgroundImage: p.image ? `url(${p.image})` : `linear-gradient(135deg,#0b0b0c,#121214)` }}
              />
            </div>
          </div>

          <div className="col-span-5 flex flex-col justify-center">
            <h3 className="mb-4 text-4xl font-semibold">{p.title}</h3>
            <p className="mb-6 text-white/70 max-w-[560px]">{p.description}</p>
            <div className="flex items-center gap-4">
              <button onClick={prev} className="rounded px-4 py-2 bg-white/6 hover:bg-white/10 transition">Previous</button>
              <button onClick={next} className="rounded px-4 py-2 bg-white/6 hover:bg-white/10 transition">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseModal;
