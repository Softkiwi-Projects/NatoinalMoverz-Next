import Link from "next/link";
import Icon from "@/components/ui/Icon";
import QuoteForm from "@/components/sections/QuoteForm";
import { site } from "@/data/site";
import { CheckDot } from "./shared";

const bullets = [
  "From furniture to home, we move everything",
  "Affordable Quotes for Local and Nationwide Moves",
  "$80 hh price (2 men & truck)",
  "Weekend and Late-Night Move Availability",
];

// Full-bleed photo under a dark left-weighted gradient, headline + checklist
// on the left and an elevated quote card on the right.
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-night">
      <img
        src="/wp-content/uploads/2025/01/40330.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/75 to-night/40" />

      <div className="container-bds relative py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_460px]">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Icon name="truck" size={16} className="text-brand" />
              <span className="font-bold text-white">{site.name}</span>
              <span className="hidden text-white/70 sm:inline">· {site.tagline}</span>
            </span>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Effortless Moving <span className="mt-1 block text-white/90">with <span className="text-brand">Trusted Experts</span></span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/80">
              Moving can be overwhelming, but the right movers make it easy. National Movers offers reliable,
              professional services tailored to your needs for a hassle-free move.
            </p>

            <ul className="mt-6 max-w-xl space-y-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckDot />
                  <span className="text-sm font-semibold text-white">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quote-form" className="btn-yellow h-14 px-8 text-base">
                Get a Free Quote
              </Link>
              <a href={site.phone.href} className="btn-glass h-14 px-8 text-base">
                <Icon name="phone" size={18} /> Call Now
              </a>
            </div>
          </div>

          <QuoteCard />
        </div>
      </div>
    </section>
  );
}

// Navy-headed white card wrapping the multi-step quote form.
export function QuoteCard({ title = "Get Your Free Quote" }) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 lg:mx-0">
      <div className="bg-navy px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-navy">
            3 quick steps
          </span>
        </div>
        <p className="mt-1 text-sm text-white/70">Step-by-step — it only takes a minute.</p>
      </div>
      <div className="p-5 sm:p-6">
        <QuoteForm variant="bds" />
      </div>
    </div>
  );
}
