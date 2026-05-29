const Button = ({ children, href = "#", variant = "primary" }) => (
  <a
    href={href}
    className={`inline-flex min-h-11 items-center justify-center rounded-full border px-6 py-2 text-sm font-medium tracking-tight transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
      variant === "primary"
        ? "bg-[var(--text)] text-[var(--bg)] border-[var(--text)]"
        : "bg-transparent text-[var(--text)] border-[var(--border)]"
    }`}
  >
    {children}
  </a>
);

export default Button;
