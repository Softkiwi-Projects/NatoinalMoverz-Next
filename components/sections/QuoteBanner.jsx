import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Flat yellow "Ready to move?" banner: heading + subtitle on the left,
// GET FREE QUOTE button and phone link on the right. Sits above the footer.
export default function QuoteBanner({
  title = "Ready to move? Get your free quote today.",
  subtitle = "Fast, friendly, and fully insured moving across New Zealand.",
  quoteHref = "/quote-form",
}) {
  return (
    <section className="bg-brand py-12">
      <div className="container-page flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-ink-strong md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 font-medium text-ink-strong/75">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={quoteHref}
            className="inline-flex items-center gap-2.5 rounded-full bg-brand-dark px-9 py-4 text-sm font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink-strong"
          >
            Get Free Quote
          </a>
          <a
            href={site.phone.href}
            className="inline-flex items-center gap-2.5 text-lg font-extrabold text-ink-strong transition-colors hover:text-brand-dark"
          >
            <Icon name="phone" size={20} /> {site.phone.label}
          </a>
        </div>
      </div>
    </section>
  );
}
