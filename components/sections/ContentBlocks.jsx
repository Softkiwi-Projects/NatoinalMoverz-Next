import Icon from "@/components/ui/Icon";

// Renders ordered content blocks (extracted from the source pages) as real,
// styled React elements — no raw HTML injection.
export default function ContentBlocks({ blocks = [], className = "" }) {
  if (!blocks.length) return null;
  return (
    <div className={`prose-nm ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        if (b.type === "ol")
          return (
            <ol key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ol>
          );
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}

// A compact variant that pulls just the paragraph blocks — handy for intros.
export function LeadParagraphs({ blocks = [], limit = 2, className = "" }) {
  const paras = blocks.filter((b) => b.type === "p").slice(0, limit);
  if (!paras.length) return null;
  return (
    <div className={`space-y-4 text-lg leading-relaxed text-ink-soft ${className}`}>
      {paras.map((p, i) => (
        <p key={i}>{p.text}</p>
      ))}
    </div>
  );
}

// Turns "h2 + following paragraphs" groups into feature cards with an icon.
export function FeatureHighlights({ blocks = [], icons = [], className = "" }) {
  const groups = [];
  let current = null;
  for (const b of blocks) {
    if (b.type === "h2" || b.type === "h3") {
      current = { title: b.text, body: [] };
      groups.push(current);
    } else if (current && b.type === "p") {
      current.body.push(b.text);
    }
  }
  const withBody = groups.filter((g) => g.body.length).slice(0, 4);
  if (withBody.length < 2) return null;
  const fallback = ["shield", "truck", "clock", "users"];
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${className}`}>
      {withBody.map((g, i) => (
        <div
          key={i}
          className="rounded-2xl border border-surface-border bg-white p-7 shadow-soft transition-transform hover:-translate-y-1"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand-dark">
            <Icon name={icons[i] || fallback[i % fallback.length]} size={24} />
          </div>
          <h3 className="mb-2 text-lg font-bold text-ink-strong">{g.title}</h3>
          <p className="text-sm leading-relaxed text-ink-soft">{g.body[0]}</p>
        </div>
      ))}
    </div>
  );
}
