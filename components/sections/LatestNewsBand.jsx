import Icon from "@/components/ui/Icon";

// Light "Latest Update" band with a faint world-map backdrop, a headline
// with emphasised words, a few quick selling points, and a dark CTA button.
export default function LatestNewsBand({
  eyebrow = "Latest Update",
  quoteHref = "/quote-form",
  points = [
    "We beat any quote by 10% for sure",
    "Long distance moves save 40% or more",
    "$80 hh price (2 men & truck)",
  ],
}) {
  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url(/wp-content/uploads/2023/10/map-02-1.png)",
          backgroundSize: "cover",
        }}
      />
      <div className="container-page relative flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
            {eyebrow}
          </span>
          <h2 className="font-heading text-3xl font-normal leading-tight text-ink-strong md:text-[2.5rem]">
            Let's Checkout our All <strong className="font-extrabold">Latest</strong> News
          </h2>
          <ul className="mt-6 space-y-2.5">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 font-semibold text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-ink-strong">
                  <Icon name="check" size={13} strokeWidth={3.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={quoteHref}
          className="inline-flex items-center gap-2.5 rounded-full bg-brand-dark px-9 py-4 text-sm font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink-strong"
        >
          Get a Free Quote <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  );
}
