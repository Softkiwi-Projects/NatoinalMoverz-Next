import Link from "next/link";
import Icon from "@/components/ui/Icon";

// "Why National Movers" — alternating dark/light feature cards, mirroring the
// original theme section. Odd-index cards are dark navy and slightly elevated.
const defaultFeatures = [
  {
    title: "Efficient and **Affordable**",
    text: "We understand that every move is unique, so we offer a range of services to fit your requirements.",
    icon: "box",
    href: "/quote-form",
  },
  {
    title: "Timely and **Safe Delivery**",
    text: "Our movers ensure that your items are picked up and delivered on time, with no delays or damages.",
    icon: "truck",
    href: "/house-moving-service",
  },
  {
    title: "**Experienced** Movers",
    text: "Our team of experienced movers are trained to handle every aspect of your relocation.",
    icon: "home",
    href: "/about-us",
  },
  {
    title: "Security and **Safety**",
    text: "Our skilled team ensures every step meets safety protocols for secure transport.",
    icon: "shield",
    href: "/about-us",
  },
];

export default function FeatureStrip({
  features = defaultFeatures,
  eyebrow = "Why National Movers",
  title = "Safe and **Reliable Moving.**",
}) {
  return (
    <section className="section">
      <div className="container-page">
        {/* Centered heading with underlined eyebrow */}
        <div className="mb-14 text-center">
          <span className="inline-block border-b-2 border-brand pb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
            {eyebrow}
          </span>
          <h2 className="mt-6 text-3xl font-normal leading-tight text-ink-strong md:text-[2.7rem]">
            {emphasise(title)}
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const dark = i % 2 === 0;
            return (
              <div
                key={f.title}
                className={`group relative flex flex-col p-8 transition-colors duration-300 hover:bg-brand lg:p-9 ${
                  dark
                    ? "z-10 bg-brand-dark text-white shadow-card lg:-my-4"
                    : "border border-surface-border bg-white text-ink"
                }`}
              >
                {/* Inset frame on dark cards */}
                {dark && (
                  <span className="pointer-events-none absolute inset-3 border border-white/20 transition-colors duration-300 group-hover:border-ink-strong/20" />
                )}

                <h3
                  className={`relative text-2xl font-normal leading-snug transition-colors duration-300 group-hover:text-ink-strong ${
                    dark ? "text-white" : "text-ink-strong"
                  }`}
                >
                  {emphasise(f.title)}
                </h3>
                <p
                  className={`relative mt-4 text-[15px] leading-relaxed transition-colors duration-300 group-hover:text-ink-strong/80 ${
                    dark ? "text-white/60" : "text-ink-soft"
                  }`}
                >
                  {f.text}
                </p>

                <div className="relative mt-auto pt-10">
                  <Icon
                    name={f.icon}
                    size={48}
                    strokeWidth={1.5}
                    className="text-brand transition-colors duration-300 group-hover:text-ink-strong"
                  />
                  <Link
                    href={f.href}
                    className={`mt-8 inline-block text-[15px] font-bold transition-colors group-hover:text-ink-strong ${
                      dark ? "text-white hover:text-brand" : "text-ink-strong hover:text-brand-dark"
                    }`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Renders **bold** spans within a heading string.
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
