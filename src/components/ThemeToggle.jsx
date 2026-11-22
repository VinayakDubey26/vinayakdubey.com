const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
  </svg>
);

const EclipseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="7" />
    <circle className="theme-toggle__eclipse-shadow" cx="15.5" cy="9" r="6" />
  </svg>
);

const ThemeToggle = ({ theme, onToggle, buttonRef, disabled = false }) => {
  const isDark = theme === "dark";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      aria-busy={disabled || undefined}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle"
    >
      {isDark ? <SunIcon /> : <EclipseIcon />}
    </button>
  );
};

export default ThemeToggle;
