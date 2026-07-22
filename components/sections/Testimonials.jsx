import Icon from "@/components/ui/Icon";
import SectionHeading from "./SectionHeading";

const defaultReviews = [
  {
    name: "Sarah M.",
    location: "Tauranga",
    text: "National Movers made our house move completely stress-free. The team was punctual, careful with our furniture, and genuinely friendly. Highly recommended!",
  },
  {
    name: "James T.",
    location: "Auckland",
    text: "We relocated our office over a weekend with zero downtime. Everything was packed, labelled, and set up exactly as planned. Superb service.",
  },
  {
    name: "Priya K.",
    location: "Hamilton",
    text: "They moved our piano and antique furniture without a single scratch. You can tell they really know what they're doing. Worth every dollar.",
  },
];

export default function Testimonials({
  reviews = defaultReviews,
  eyebrow = "What Our Customers Are Saying",
  title = "Client Testimonials",
}) {
  return (
    <section className="section bg-surface-muted">
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-12" />
        <div className="grid gap-7 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-2xl bg-white p-7 shadow-soft"
            >
              <Icon name="quote" size={36} className="mb-4 text-brand" />
              <blockquote className="flex-1 text-ink-soft">{r.text}</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-surface-border pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/20 font-extrabold text-brand-dark">
                  {r.name.charAt(0)}
                </span>
                <figcaption>
                  <p className="font-bold text-ink-strong">{r.name}</p>
                  <div className="flex items-center gap-1 text-brand">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="star" size={13} strokeWidth={1.5} />
                    ))}
                    <span className="ml-1 text-xs text-ink-soft">{r.location}</span>
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
