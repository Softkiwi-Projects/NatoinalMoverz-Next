import Link from "next/link";
import Icon from "@/components/ui/Icon";

// Renders inline runs ({t, b?, i?, href?}) as styled React elements —
// bold, italic and links survive extraction without raw HTML injection.
function Inline({ runs, text }) {
  if (!runs?.length) return text ?? null;
  return runs.map((r, i) => {
    let node = r.t;
    if (r.b) node = <strong key={`b${i}`}>{node}</strong>;
    if (r.i) node = <em key={`i${i}`}>{node}</em>;
    if (r.href) {
      const cls = "font-semibold text-brand-dark underline decoration-brand decoration-2 underline-offset-2 hover:text-ink-strong";
      node = r.href.startsWith("/") ? (
        <Link key={`a${i}`} href={r.href} className={cls}>
          {node}
        </Link>
      ) : (
        <a key={`a${i}`} href={r.href} className={cls} target="_blank" rel="noopener noreferrer">
          {node}
        </a>
      );
    }
    return r.b || r.i || r.href ? node : <span key={i}>{node}</span>;
  });
}

// Renders ordered content blocks (extracted from the source pages) as real,
// styled React elements — no raw HTML injection.
export default function ContentBlocks({ blocks = [], className = "" }) {
  if (!blocks.length) return null;
  return (
    <div className={`prose-nm ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <h2 key={i}>
              <Inline runs={b.runs} text={b.text} />
            </h2>
          );
        if (b.type === "h3")
          return (
            <h3 key={i}>
              <Inline runs={b.runs} text={b.text} />
            </h3>
          );
        if (b.type === "ul" || b.type === "ol") {
          const ListTag = b.type;
          return (
            <ListTag key={i}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline runs={b.runsItems?.[j]} text={it} />
                </li>
              ))}
            </ListTag>
          );
        }
        return (
          <p key={i}>
            <Inline runs={b.runs} text={b.text} />
          </p>
        );
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
