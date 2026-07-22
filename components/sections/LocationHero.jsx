import Icon from "@/components/ui/Icon";
import QuoteForm from "./QuoteForm";
import { site } from "@/data/site";

const defaultBullets = [
  "We are your same-day movers for fast relocation",
  "$80 hh price (2 men & truck)",
  "Trusted and experienced staff",
  "Beat any quote by 10%",
];

// Location-page hero: copy + checklist + CTAs on the left, the multi-step
// quote form in an elevated dark card on the right.
export default function LocationHero({
  eyebrow = "National Movers",
  title = "Leading Moving Company",
  // City name gets emphasised (bold) wherever it appears in the title.
  city = "",
  description,
  bullets = defaultBullets,
  image = "/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-02-at-15.27.17-scaled.jpeg",
  mobileImage = "/wp-content/uploads/2023/10/bg-new-03-1.jpg",
}) {
  const desc =
    description ||
    `Moving can be overwhelming, but the right movers make it easy. National Movers offers reliable, professional services tailored to your needs for a hassle-free move${city ? ` in ${city}` : ""}.`;

  return (
    <section className="relative overflow-hidden">
      {/* Mobile background: photo + heavy dark scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${mobileImage})` }}
      />
      <div className="absolute inset-0 bg-brand-dark/85 md:hidden" />

      {/* Desktop background image + scrims */}
      <div
        className="absolute inset-0 hidden bg-cover bg-no-repeat md:block"
        style={{ backgroundImage: `url(${image})`, backgroundPosition: "bottom center" }}
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-brand-dark/20 md:block" />

      <div className="container-page relative grid items-center gap-10 pb-12 pt-12 md:pb-16 md:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Copy */}
        <div className="text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </span>
          <h1 className="text-4xl font-light leading-[1.1] text-white md:text-5xl">
            {emphasiseCity(title, city)}
          </h1>
          <p className="mt-5 hidden max-w-xl text-lg text-white/90 md:block">{desc}</p>

          <ul className="mt-7 hidden space-y-3 md:block">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 font-medium text-white">
                <Icon name="check" size={20} strokeWidth={3} className="shrink-0 text-brand" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 hidden flex-wrap gap-4 md:flex">
            <a href={site.phone.href} className="btn-primary">
              Call Us <Icon name="arrow" size={18} />
            </a>
            <a href="/quote-form" className="btn-primary">
              Get a Free Quote <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>

        {/* Quote form — plain on the dark mobile hero, elevated dark card on desktop */}
        <div className="md:rounded-3xl md:bg-brand-dark/90 md:p-8 md:shadow-card md:backdrop-blur-sm">
          <h2 className="mb-6 bg-black/50 px-4 py-3 text-2xl font-extrabold text-brand md:bg-transparent md:px-0 md:py-0 md:text-3xl md:text-white">
            Get a Free Quote
          </h2>
          <QuoteForm variant="hero" />
        </div>
      </div>
    </section>
  );
}

// Bolds the city name wherever it appears in the headline.
function emphasiseCity(title, city) {
  if (!city || !title.includes(city)) return title;
  const parts = title.split(city);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <strong className="font-extrabold">{city}</strong>}
    </span>
  ));
}
