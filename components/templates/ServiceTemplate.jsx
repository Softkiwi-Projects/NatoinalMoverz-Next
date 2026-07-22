import QuoteForm from "@/components/sections/QuoteForm";
import GoogleReviews from "@/components/sections/GoogleReviews";
import CTA from "@/components/sections/CTA";
import Icon from "@/components/ui/Icon";
import { getBlocks } from "@/lib/content";
import { getServiceDetails, WHY_CHOOSE, HOURS, DEFAULT_STRIP } from "@/data/serviceDetails";
import { site } from "@/data/site";

/**
 * Service Template — mirrors the original nationalmovers.co.nz service page:
 *
 *   1. Hero: service photo background + yellow card with the multi-step quote form
 *   2. Intro paragraphs ("Your Stress-Free ... Partner in Tauranga!")
 *   3. Icon feature tiles + Call Us / Get a Free Quote buttons
 *   4. Google reviews strip
 *   5. "Comprehensive <Service> Services in Tauranga" — alternating image/text rows
 *   6. Dark reassurance strip
 *   7. Yellow "adventure" card + open-7-days / 24×7 items
 *   8. "Why Choose National Movers?" dark panel with accordion
 *   9. GET STARTED CTA band + yellow contact strip
 */
export default function ServiceTemplate({ service }) {
  const d = getServiceDetails(service.slug) || {};
  const blocks = getBlocks(service.slug);

  // Intro copy comes from the page's real content blocks: the second h2 is the
  // intro heading, followed by its paragraphs (up to the next heading).
  const intro = extractIntro(blocks, service);

  const features = d.features || [];
  const rows = d.rows || [];

  return (
    <>
      {/* 1 — HERO: photo + yellow quote card */}
      <section
        id="quote"
        className="relative scroll-mt-24 bg-cover bg-center"
        style={{ backgroundImage: `url(${service.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-black/20" />
        <div className="container-page relative py-12 md:py-16">
          <div className="mx-auto max-w-3xl rounded-3xl bg-brand px-6 py-9 text-center shadow-card md:px-12 md:py-11">
            <h1 className="font-heading text-3xl font-extrabold text-ink-strong md:text-4xl">
              {d.heroTitle || `${service.title} Tauranga`}
            </h1>
            <p className="mx-auto mt-3 max-w-xl font-medium text-ink-strong/75">
              {d.heroSub || service.excerpt}
            </p>
            <h2 className="mb-5 mt-7 text-2xl font-extrabold text-ink-strong">Get a Free Quote</h2>
            <QuoteForm variant="yellow" />
          </div>
        </div>
      </section>

      {/* 2 — INTRO PARAGRAPHS */}
      <section className="section pb-10 md:pb-12">
        <div className="container-page mx-auto max-w-4xl text-center">
          <h2 className="section-title">{intro.heading}</h2>
          <div className="mt-6 space-y-5 text-left text-[1.02rem] leading-relaxed text-ink-soft md:text-center">
            {intro.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — ICON FEATURE TILES + BUTTONS */}
      {features.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="container-page">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-brand text-ink-strong shadow-soft">
                    <Icon name={f.icon} size={32} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-ink-strong">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{f.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <a href={site.phone.href} className="btn-dark">
                <Icon name="phone" size={16} /> Call Us
              </a>
              <a href="#quote" className="btn-primary">
                Get a Free Quote
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 4 — GOOGLE REVIEWS STRIP */}
      <GoogleReviews />

      {/* 5 — COMPREHENSIVE SERVICES: alternating rows */}
      {rows.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="mx-auto mb-4 max-w-3xl text-center">
              <span className="eyebrow">National Movers</span>
              <h2 className="section-title">
                {d.rowsHeading || `Comprehensive ${service.title}s in Tauranga`}
              </h2>
            </div>

            {rows.map((r, i) => (
              <div
                key={r.title}
                className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16"
              >
                {/* Collage-framed image: yellow block + dark offset behind the photo */}
                <div className={`relative ${i % 2 ? "lg:order-2" : ""}`}>
                  <div
                    className={`absolute -bottom-4 h-2/3 w-2/3 rounded-lg bg-brand ${
                      i % 2 ? "-left-4" : "-right-4"
                    }`}
                  />
                  <div
                    className={`absolute -top-4 h-2/3 w-2/3 rounded-lg bg-brand-dark/90 ${
                      i % 2 ? "-right-4" : "-left-4"
                    }`}
                  />
                  <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    className="relative aspect-[4/3] w-full rounded-lg object-cover shadow-card"
                  />
                </div>

                <div className={i % 2 ? "lg:order-1" : ""}>
                  <h3 className="mb-4 text-2xl font-extrabold text-ink-strong">{r.title}</h3>
                  <p className="leading-relaxed text-ink-soft">{r.text}</p>
                  {r.bullets && (
                    <ul className="mt-5 space-y-3">
                      {r.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 font-medium text-ink">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-dark">
                            <Icon name="check" size={12} strokeWidth={3.5} className="text-brand" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6 — DARK REASSURANCE STRIP */}
      <section className="bg-brand-dark py-9">
        <div className="container-page">
          <p className="mx-auto max-w-4xl text-center text-lg font-semibold text-white">
            {d.strip || DEFAULT_STRIP}
          </p>
        </div>
      </section>

      {/* 7 — ADVENTURE CARD + HOURS */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col items-start rounded-3xl bg-brand p-9 shadow-card md:p-10">
            <span className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-ink-strong/70">
              National Movers
            </span>
            <h2 className="mb-4 font-heading text-3xl font-extrabold text-ink-strong">
              {d.adventure?.heading || "Your Move Starts Today"}
            </h2>
            <p className="mb-8 font-medium leading-relaxed text-ink-strong/75">
              {d.adventure?.text ||
                "Don't let the moving process weigh you down. Contact National Movers today — request a quote online or call us, and our friendly team will make your transition completely stress-free."}
            </p>
            <a href="#quote" className="btn-dark mt-auto">
              Get a Free Quote
            </a>
          </div>

          <div className="flex flex-col justify-center gap-9">
            {HOURS.map((h) => (
              <div key={h.title} className="flex items-start gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-dark text-brand">
                  <Icon name={h.icon} size={26} />
                </span>
                <div>
                  <h3 className="mb-1.5 text-lg font-extrabold uppercase tracking-wide text-ink-strong">
                    {h.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — WHY CHOOSE NATIONAL MOVERS? */}
      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <span className="eyebrow">Why Choose</span>
          <h2 className="section-title mb-8">National Movers?</h2>

          <div className="grid gap-10 rounded-3xl bg-brand-dark p-8 md:p-11 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <p className="leading-relaxed text-white/85">
              {d.whyIntro ||
                "There are countless moving companies in and around Tauranga, so for anyone to trust us with everything they own, we know we have to earn it — on the factors that matter most:"}
            </p>
            <div className="space-y-2.5">
              {(d.why || WHY_CHOOSE).map((w, i) => (
                <details
                  key={w.title}
                  open={i === 0}
                  className="group overflow-hidden rounded-xl bg-brand"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 font-bold text-ink-strong [&::-webkit-details-marker]:hidden">
                    {w.title}
                    <Icon
                      name="chevron"
                      size={16}
                      strokeWidth={3}
                      className="shrink-0 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="px-5 pb-4 text-sm font-medium leading-relaxed text-ink-strong/75">
                    {w.text}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 — GET STARTED + CONTACT STRIP */}
      <CTA
        title={d.getStarted?.title || `Need a reliable ${service.title.toLowerCase()}?`}
        subtitle={
          d.getStarted?.subtitle ||
          "Request a quote online or call us to discuss your move. Let our friendly team make your transition stress-free."
        }
      />

      <section className="bg-brand py-8">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          <ContactItem icon="phone" label="Phone" href={site.phone.href}>
            {site.phone.label} · {site.altPhone.label}
          </ContactItem>
          <ContactItem icon="map" label="Address" href={site.address.href}>
            {site.address.line}
          </ContactItem>
          <ContactItem icon="mail" label="Email" href={`mailto:${site.email}`}>
            {site.email}
          </ContactItem>
        </div>
      </section>
    </>
  );
}

function ContactItem({ icon, label, href, children }) {
  return (
    <a href={href} className="flex items-center justify-center gap-4 sm:justify-start lg:justify-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-dark text-brand">
        <Icon name={icon} size={22} />
      </span>
      <span className="leading-snug">
        <b className="block text-ink-strong">{label}</b>
        <span className="text-sm font-medium text-ink-strong/75">{children}</span>
      </span>
    </a>
  );
}

// Pull the intro heading + paragraphs out of the page's content blocks:
// skip the first h2 (page title), use the next h2/h3 as the intro heading,
// then collect the paragraphs that follow it.
function extractIntro(blocks, service) {
  const fallback = {
    heading: `Your Trusted ${service.title} in Tauranga`,
    paras: [service.excerpt].filter(Boolean),
  };
  if (!blocks.length) return fallback;

  let i = 0;
  // First h2 usually repeats the page title — skip it.
  if (blocks[i]?.type === "h2") i += 1;
  // Next heading is the intro heading.
  while (i < blocks.length && blocks[i].type !== "h2" && blocks[i].type !== "h3") i += 1;
  if (i >= blocks.length) return fallback;
  const heading = blocks[i].text;
  i += 1;

  const paras = [];
  while (i < blocks.length && blocks[i].type === "p") {
    paras.push(blocks[i].text);
    i += 1;
  }
  if (!paras.length) return { heading, paras: fallback.paras };
  return { heading, paras };
}
