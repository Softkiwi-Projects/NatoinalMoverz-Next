import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Persistent right-edge tab — a phone-call button stacked above a vertical
// "Get free Quote" ribbon, fixed to the viewport like the original theme's
// sticky call-to-action widget.
export default function FloatingQuoteTab() {
  return (
    <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col shadow-card sm:flex">
      <a
        href={site.phone.href}
        aria-label={`Call ${site.phone.label}`}
        className="flex h-14 w-14 items-center justify-center bg-brand-dark transition-colors hover:bg-ink-strong"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-ink-strong">
          <Icon name="phone" size={16} />
        </span>
      </a>
      <Link
        href="/quote-form"
        className="flex h-36 w-14 items-center justify-center overflow-hidden bg-brand text-ink-strong transition-colors hover:bg-brand-light"
      >
        <span className="whitespace-nowrap text-xs font-extrabold uppercase tracking-wide [transform:rotate(-90deg)]">
          Get free Quote
        </span>
      </Link>
    </div>
  );
}
