import TitleBar from "@/components/layout/TitleBar";
import QuoteForm from "@/components/sections/QuoteForm";
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

const details = [
  { icon: "phone", label: "Phone", value: site.phone.label, href: site.phone.href },
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "map", label: "Address", value: site.address.line, href: site.address.href },
  { icon: "clock", label: "Hours", value: site.hours },
];

export default function ContactsPage() {
  return (
    <>
      <TitleBar
        title="Contact Us"
        subtitle="Get in touch for a free quote or any questions about your move."
        crumbs={[{ label: "Contacts" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Get In Touch</span>
            <h2 className="section-title mb-4">We'd love to help with your move</h2>
            <p className="mb-8 text-lg text-ink-soft">
              Reach out by phone or email, or send us your details and we'll get back to you with a
              tailored, no-obligation quote.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-start gap-4 rounded-2xl border border-surface-border bg-white p-5 shadow-soft"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-dark">
                    <Icon name={d.icon} size={22} />
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a href={d.href} className="font-semibold text-ink-strong hover:text-brand-dark">
                        {d.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-ink-strong">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
              <iframe
                title="National Movers location"
                src="https://www.google.com/maps?q=Sixteenth+Avenue+Tauranga&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                className="block border-0"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-ink-strong">Request a Free Quote</h2>
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
