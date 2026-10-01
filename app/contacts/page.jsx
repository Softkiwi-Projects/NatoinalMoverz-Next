import QuoteForm from "@/components/sections/QuoteForm";
import GoogleReviews from "@/components/sections/GoogleReviews";
import FocusedBand from "@/components/sections/FocusedBand";
import ServicesGrid from "@/components/sections/ServicesGrid";
import LatestNewsBand from "@/components/sections/LatestNewsBand";
import ContactStrip from "@/components/sections/ContactStrip";
import Icon from "@/components/ui/Icon";
import { getPageContent } from "@/lib/content";
import { site } from "@/data/site";
import { cleanTitle, getCanonicalUrl, DEFAULT_ROBOTS, buildBreadcrumbJsonLd } from "@/lib/seo";

export function generateMetadata() {
  const page = getPageContent("contacts");
  const title = cleanTitle(page?.title, "Contact Us");
  const description =
    page?.description ||
    "Contact National Movers today. Call 0800 600 003 or send an enquiry for fast, reliable moving quotes in Tauranga and across New Zealand.";
  const canonicalUrl = getCanonicalUrl("contacts");
  const ogImage = `${site.url}/wp-content/uploads/2025/01/40330.jpg`;

  return {
    title,
    description,
    robots: DEFAULT_ROBOTS,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: canonicalUrl,
      siteName: site.name,
      locale: "en_NZ",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Contact National Movers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage],
    },
  };
}

const cards = [
  { icon: "map", label: "Our Address", value: site.address.line, href: site.address.href },
  { icon: "phone", label: "Phone Number", value: site.phone.label, href: site.phone.href },
  { icon: "mail", label: "Email Address", value: site.email, href: `mailto:${site.email}` },
];

export default function ContactsPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Contact Us", item: "/contacts/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* FULL-WIDTH MAP */}
      <section className="relative">
        <iframe
          title="National Movers — Tauranga"
          src="https://www.google.com/maps?q=36a+Sixteenth+Avenue+Tauranga&z=10&output=embed"
          className="block h-[340px] w-full border-0 md:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* CONTACT INFO CARDS OVERLAPPING MAP */}
      <section className="relative z-10 -mt-14 pb-12">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <div
                key={c.label}
                className="group flex items-start gap-4 rounded-2xl border border-surface-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-ink-strong shadow-soft transition-transform group-hover:scale-110">
                  <Icon name={c.icon} size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    {c.label}
                  </p>
                  <a
                    href={c.href}
                    className="mt-1 block text-base font-bold text-ink-strong transition-colors hover:text-brand-dark"
                  >
                    {c.value}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM + QUOTE */}
      <section className="section bg-surface-light">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-card md:p-12">
            <div className="mb-8 text-center">
              <span className="inline-block border-b-2 border-brand pb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
                Get In Touch
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-ink-strong md:text-4xl">
                Send Us a <span className="text-brand-dark">Message</span>
              </h1>
              <p className="mt-2 text-ink-soft">
                Have questions about your move? Fill in the details below and our team will get back to you promptly.
              </p>
            </div>
            <QuoteForm />
          </div>
        </div>
      </section>

      <FocusedBand />
      <ServicesGrid />
      <GoogleReviews />
      <LatestNewsBand />
      <ContactStrip />
    </>
  );
}
