import TitleBar from "@/components/layout/TitleBar";
import QuoteForm from "@/components/sections/QuoteForm";
import Icon from "@/components/ui/Icon";
import { getPageContent } from "@/lib/content";
import { site } from "@/data/site";

export function generateMetadata() {
  const page = getPageContent("quote-form");
  return {
    title: page?.title || "Get a Free Quote",
    description: page?.description || "Request a fast, free moving quote from National Movers.",
    alternates: { canonical: "/quote-form" },
  };
}

const perks = [
  "Fast, no-obligation estimate",
  "Transparent, upfront pricing",
  "Fully insured, professional crews",
  "Local & long-distance moves",
];

export default function QuoteFormPage() {
  return (
    <>
      <TitleBar
        title="Get a Free Quote"
        subtitle="Tell us about your move and we'll send you a tailored estimate."
        crumbs={[{ label: "Quote Form" }]}
      />

      <section className="section">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Free & Fast</span>
            <h2 className="section-title mb-5">A stress-free move starts here</h2>
            <p className="mb-8 text-lg text-ink-soft">
              Complete the short form and one of our moving specialists will be in touch with a
              competitive quote for your relocation.
            </p>
            <ul className="mb-8 space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 font-semibold text-ink-strong">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-ink-strong">
                    <Icon name="check" size={16} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-surface-muted p-6">
              <p className="mb-2 font-bold text-ink-strong">Prefer to talk?</p>
              <a href={site.phone.href} className="flex items-center gap-2 text-lg font-extrabold text-brand-dark">
                <Icon name="phone" size={20} /> {site.phone.label}
              </a>
            </div>
          </div>

          <QuoteForm />
        </div>
      </section>
    </>
  );
}
