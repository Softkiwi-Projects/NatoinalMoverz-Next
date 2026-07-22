import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// "GET STARTED" call-to-action band, reused at the bottom of most pages.
// Premium treatment: deep navy gradient with soft yellow glows and a faint
// world-map texture, oversized heading, and pill CTAs with glow + hover lift.
export default function CTA({
  eyebrow = "Get Started",
  title = "Planning a move? Let's make it easy.",
  subtitle = "Get a free, no-obligation quote today and let our experts handle the heavy lifting.",
  quoteHref = "/quote-form",
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-20 md:py-28">
      {/* Layered backdrop: navy gradient + soft yellow glows + map texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b2c38] via-brand-dark to-[#0c151c]" />
      <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand/15 blur-[130px]" />
      <div className="absolute -bottom-48 -right-24 h-[460px] w-[460px] rounded-full bg-brand/10 blur-[150px]" />
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-[0.07]"
        style={{
          backgroundImage: "url(/wp-content/uploads/2023/10/map-02-1.png)",
          backgroundSize: "cover",
        }}
      />
      {/* Hairline accents top & bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="container-page relative mx-auto max-w-4xl text-center">
        {/* Eyebrow with side rules */}
        <div className="mb-5 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand/80" />
          <span className="text-sm font-extrabold uppercase tracking-[0.28em] text-brand">
            {eyebrow}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand/80" />
        </div>

        <h2 className="font-heading text-3xl font-extrabold leading-[1.15] text-white md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{subtitle}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={quoteHref}
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-10 py-4 text-base font-extrabold uppercase tracking-wide text-ink-strong shadow-[0_12px_36px_-8px_rgba(255,211,50,0.55)] transition-all duration-200 hover:-translate-y-1 hover:bg-brand-light hover:shadow-[0_18px_44px_-8px_rgba(255,211,50,0.65)]"
          >
            Get a Free Quote
            <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={site.phone.href}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-9 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand/60 hover:bg-white/10 hover:text-brand"
          >
            <Icon name="phone" size={18} /> {site.phone.label}
          </a>
        </div>

        {/* Trust row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/50">
          <span className="flex items-center gap-1 text-brand" aria-label="5 star rated">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" size={13} strokeWidth={1.5} />
            ))}
          </span>
          <span className="font-medium text-white/70">Rated excellent by Tauranga families</span>
          <span aria-hidden="true">·</span>
          <span>Free quotes</span>
          <span aria-hidden="true">·</span>
          <span>Open 7 days</span>
          <span aria-hidden="true">·</span>
          <span>NZ-wide moves</span>
        </div>
      </div>
    </section>
  );
}
