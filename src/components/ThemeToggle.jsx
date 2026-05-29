const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label="Toggle theme"
    className="fixed right-5 top-5 z-50 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]"
  >
    {theme === "dark" ? "Light" : "Dark"}
  </button>
);

export default ThemeToggle;
