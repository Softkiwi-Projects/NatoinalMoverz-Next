import { services as allServices } from "@/data/services";
import ServiceCard from "./ServiceCard";

export default function ServicesGrid({
  services = allServices,
  eyebrow = "Why National Movers",
  title = "Our **Quality** Services",
  subtitle,
  showHeading = true,
}) {
  return (
    <section className="section bg-surface-light">
      <div className="container-page">
        {showHeading && (
          <div className="mb-14 text-center">
            <span className="inline-block border-b-2 border-brand pb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
              {eyebrow}
            </span>
            <h2 className="mt-6 text-3xl font-normal leading-tight text-ink-strong md:text-[2.7rem]">
              {emphasise(title)}
            </h2>
            {subtitle && <p className="mx-auto mt-4 max-w-2xl text-ink-soft">{subtitle}</p>}
          </div>
        )}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Renders **bold** spans within the heading.
function emphasise(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-extrabold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
