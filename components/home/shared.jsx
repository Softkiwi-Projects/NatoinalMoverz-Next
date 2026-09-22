import Icon from "@/components/ui/Icon";

// Renders **emphasised** spans with the homepage's yellow accent: a highlighter
// underline on light backgrounds, yellow text on navy (pass className="text-brand").
export function Emphasis({ text, className = "hl-yellow" }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <span key={i} className={className}>
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// Centred pill eyebrow + large navy heading + optional lead paragraph.
export function HomeHeading({ eyebrow, title, subtitle, light = false, align = "center", className = "mb-12" }) {
  const centred = align === "center";
  return (
    <div className={`${centred ? "mx-auto max-w-2xl text-center" : ""} ${className}`}>
      {eyebrow && <span className="pill-yellow">{eyebrow}</span>}
      <h2 className={`h2-bds mt-4 ${light ? "text-white" : ""}`}>
        <Emphasis text={title} className={light ? "text-brand" : "hl-yellow"} />
      </h2>
      {subtitle && (
        <p className={`mt-4 text-pretty leading-relaxed ${light ? "text-white/70" : "text-gray-700"}`}>{subtitle}</p>
      )}
    </div>
  );
}

// Small round check used in bullet lists.
export function CheckDot({ tone = "brand" }) {
  const cls = tone === "success" ? "bg-success/15 text-success" : "bg-brand text-navy";
  return (
    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${cls}`}>
      <Icon name="check" size={12} strokeWidth={3.5} />
    </span>
  );
}
