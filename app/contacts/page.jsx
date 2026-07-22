import QuoteForm from "@/components/sections/QuoteForm";
import GoogleReviews from "@/components/sections/GoogleReviews";
import FocusedBand from "@/components/sections/FocusedBand";
import ServicesGrid from "@/components/sections/ServicesGrid";
import LatestNewsBand from "@/components/sections/LatestNewsBand";
import ContactStrip from "@/components/sections/ContactStrip";
import Icon from "@/components/ui/Icon";
import { getPageContent } from "@/lib/content";
import { site } from "@/data/site";

export function generateMetadata() {
  const page = getPageContent("contacts");
  return {
    title: page?.title || "Contact Us",
    description: page?.description,
    alternates: { canonical: "/contacts" },
  };
}

const cards = [
  { icon: "map", label: "Our Address", value: site.address.line, href: site.address.href },
  { icon: "phone", label: "Phone Number", value: site.phone.label, href: site.phone.href },
  { icon: "mail", label: "Email Address", value: site.email, href: `mailto:${site.email}` },
];

export default function ContactsPage() {
  return (
    <>
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

      {/* THREE ICON CARDS */}
      <section className="section">
        <div className="container-page grid gap-8 text-center sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="flex flex-col items-center">
              <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand text-ink-strong shadow-soft">
                <Icon name={c.icon} size={34} />
              </span>
              <h3 className="mb-1.5 text-lg font-extrabold text-ink-strong">{c.label}</h3>
              {c.href ? (
                <a href={c.href} className="font-medium text-ink-soft transition-colors hover:text-brand-dark">
                  {c.value}
                </a>
              ) : (
                <p className="font-medium text-ink-soft">{c.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DROP US A LINE — quote form */}
      <section className="section pt-0">
        <div className="container-page mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
              Contact Us
            </span>
            <h2 className="text-3xl font-normal text-ink-strong md:text-[2.5rem]">
              Drop us a <strong className="font-extrabold">line</strong>
            </h2>
          </div>
          <QuoteForm variant="panel" />
        </div>
      </section>

      {/* REVIEWS */}
      <GoogleReviews />

      {/* FOCUSED ON QUALITY BAND */}
      <FocusedBand />

      {/* OUR QUALITY SERVICES */}
      <ServicesGrid />

      {/* LATEST NEWS BAND */}
      <LatestNewsBand />

      {/* CONTACT STRIP */}
      <ContactStrip />
    </>
  );
}
