import QuoteForm from "./QuoteForm";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

const trustPoints = [
  "Fully insured & licensed movers",
  "1200+ successful relocations",
  "Transparent, upfront pricing",
  "Friendly, professional crews",
];

// "Your Trusted Moving Partner" — a premium dark panel pairing persuasive
// copy with the multi-step quote form in an elevated white card.
export default function PlanMove() {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      {/* Soft brand glows for depth */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      {/* Faint dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative grid items-center gap-12 py-20 md:py-24 lg:grid-cols-2">
        {/* Left — copy + trust points */}
        <div>
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-brand">
            National Movers
          </span>
          <h2 className="text-3xl font-normal leading-tight text-white md:text-[2.7rem]">
            Your Trusted <strong className="font-extrabold">Moving</strong> Partner
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
            Planning a move? Tell us a few details and our team will put together a fast, no-obligation
            quote tailored to your relocation — local or nationwide.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {trustPoints.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/90">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-ink-strong">
                  <Icon name="check" size={16} strokeWidth={3} />
                </span>
                <span className="text-sm font-medium">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-brand">
              <Icon name="phone" size={22} />
            </span>
            <div>
              <p className="text-sm text-white/60">Prefer to talk? Call us anytime</p>
              <a
                href={site.phone.href}
                className="text-xl font-extrabold text-white transition-colors hover:text-brand"
              >
                {site.phone.label}
              </a>
            </div>
          </div>
        </div>

        {/* Right — elevated quote card */}
        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5">
            <h3 className="text-2xl font-extrabold text-ink-strong">Get a Free Quote</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Step-by-step — it only takes a minute.
            </p>
          </div>
          <QuoteForm variant="panel" />
        </div>
      </div>
    </section>
  );
}
