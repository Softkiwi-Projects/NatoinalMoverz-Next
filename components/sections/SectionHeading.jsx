export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  light = false,
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={`section-title ${light ? "text-white" : ""}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-lg ${light ? "text-white/80" : "text-ink-soft"}`}>{subtitle}</p>
      )}
    </div>
  );
}
