import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";
import { CheckDot, Emphasis } from "./shared";
import { QuoteCard } from "./HomeHero";

const trustPoints = [
  "Fully insured & licensed movers",
  "1200+ successful relocations",
  "Transparent, upfront pricing",
  "Friendly, professional crews",
];

// Closing navy panel: persuasive copy + phone on the left, quote card right.
export default function HomeQuoteCta() {
  return (
    <section className="section-bds relative overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/15 blur-3xl" />
      <div className="container-bds relative grid items-center gap-10 lg:grid-cols-[1fr_460px] lg:gap-16">
        <div>
          <span className="pill-yellow">National Movers</span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            <Emphasis text="Your Trusted **Moving** Partner" className="text-brand" />
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-white/70">
            Planning a move? Tell us a few details and our team will put together a fast, no-obligation quote
            tailored to your relocation — local or nationwide.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {trustPoints.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm font-semibold text-white">
                <CheckDot />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand text-navy shadow-lg shadow-brand/30">
              <Icon name="phone" size={20} />
            </span>
            <div>
              <p className="text-sm text-white/60">Prefer to talk? Call us anytime</p>
              <a href={site.phone.href} className="text-xl font-extrabold text-white transition-colors hover:text-brand">
                {site.phone.label}
              </a>
            </div>
          </div>
        </div>

        <QuoteCard title="Get a Free Quote" />
      </div>
    </section>
  );
}
