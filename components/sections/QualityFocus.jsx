import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

// "Focused on Quality" — image + statement section from the original home page.
export default function QualityFocus({
  eyebrow = "Focused on Quality",
  title = "We take care of your belongings like they're our own.",
  text = "From the first box to the last, our team treats every item with the attention it deserves. Careful handling, quality materials, and a genuine commitment to getting your move right — that's the National Movers difference.",
  image = "/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-24-at-13.01.41-e1756786317436.jpeg",
  points = [
    "Trained, background-checked movers",
    "Premium packing & protective materials",
    "Transparent pricing — no hidden fees",
  ],
}) {
  return (
    <section className="section bg-surface-muted">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title mb-5">{title}</h2>
          <p className="mb-6 text-lg text-ink-soft">{text}</p>
          <ul className="mb-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 font-semibold text-ink-strong">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-ink-strong">
                  <Icon name="check" size={16} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Button href="/quote-form" withArrow>
            Get a Free Quote
          </Button>
        </div>
        <div className="order-1 lg:order-2">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img src={image} alt="National Movers caring for your belongings" className="w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
