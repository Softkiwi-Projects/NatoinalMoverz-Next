import Icon from "@/components/ui/Icon";
import QuoteForm from "./QuoteForm";

const defaultBullets = [
  "From furniture to home, we move everything",
  "Affordable Quotes for Local and Nationwide Moves",
  "$80 hh price (2 men & truck)",
  "Weekend and Late-Night Move Availability",
];

// Home hero — mirrors the original: full-bleed moving photo, headline with
// emphasised words, a checklist, and the embedded multi-step quote form.
export default function Hero({
  eyebrow = "National Movers",
  // Words wrapped in ** ** render bold/emphasised, matching the source markup.
  title = "Effortless **Moving** with Trusted **Experts**",
  description = "Moving can be overwhelming, but the right movers make it easy. National Movers offers reliable, professional services tailored to your needs for a hassle-free move.",
  bullets = defaultBullets,
  // Exact asset + positioning from the original theme's hero section CSS:
  // background-image: url(.../40330.jpg); background-position: bottom center;
  // background-size: cover; background-repeat: no-repeat;
  image = "/wp-content/uploads/2025/01/40330.jpg",
  // Mobile uses a different photo under a near-solid dark overlay so the
  // white text stays readable at full width.
  mobileImage = "/wp-content/uploads/2023/10/bg-new-03-1.jpg",
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Mobile background: photo + heavy dark scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${mobileImage})` }}
      />
      <div className="absolute inset-0 bg-brand-dark/85 md:hidden" />

      {/* Desktop background image */}
      <div
        className="absolute inset-0 hidden bg-cover bg-no-repeat md:block"
        style={{ backgroundImage: `url(${image})`, backgroundPosition: "bottom center" }}
      />
      {/* Two soft scrims for legibility without hiding the photo:
          a left-weighted horizontal fade (behind the text) + a gentle
          bottom fade (behind the form). Both clear well before mid-image. */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-dark/70 via-brand-dark/25 to-transparent to-65% md:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-black/30 via-transparent to-transparent md:block" />

      <div className="container-page relative pb-8 pt-10 md:pb-10 md:pt-14">
        <div className="max-w-2xl text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-[3.4rem]">
            {renderEmphasis(title)}
          </h1>
          <p className="mt-5 hidden max-w-xl text-lg text-white/90 md:block">{description}</p>

          <ul className="mt-7 hidden space-y-3 md:block">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 font-medium text-white">
                <Icon name="check" size={20} strokeWidth={3} className="shrink-0 text-brand" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 md:mt-9">
            <h2 className="mb-4 bg-black/50 px-4 py-3 text-2xl font-extrabold text-brand md:bg-transparent md:px-0 md:py-0 md:text-3xl md:text-white">
              Get a Free Quote
            </h2>
            <QuoteForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Renders **bold** spans within the headline.
function renderEmphasis(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
