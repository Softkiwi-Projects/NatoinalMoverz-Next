import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// "Focused on Quality" — full-width dark photographic band with a statement
// and CALL US / GET A FREE QUOTE buttons. Matches the original site's band.
export default function FocusedBand({
  eyebrow = "Focused on Quality",
  title = "We take care of your belongings like they're our own.",
  image = "/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-24-at-13.01.41-e1756786317436.jpeg",
  quoteHref = "/quote-form",
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/40" />
      <div className="container-page relative flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-xl">
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </span>
          <h2 className="font-heading text-3xl font-extrabold leading-tight text-white md:text-[2.5rem]">
            {title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href={site.phone.href}
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand"
          >
            Call Us <Icon name="arrow" size={16} />
          </a>
          <a
            href={quoteHref}
            className="inline-flex items-center gap-2.5 rounded-full bg-brand px-8 py-3.5 text-sm font-extrabold uppercase tracking-wide text-ink-strong transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light"
          >
            Get a Free Quote <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
