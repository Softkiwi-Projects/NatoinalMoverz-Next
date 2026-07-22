import Icon from "@/components/ui/Icon";
import SectionHeading from "./SectionHeading";

const defaultItems = [
  {
    icon: "users",
    title: "Experienced Team",
    text: "National Movers ensures smooth moves with skilled movers, top equipment, and GPS-tracked transport.",
  },
  {
    icon: "shield",
    title: "Guaranteed Satisfaction",
    text: "Stress-free moving across NZ with expert care for your fragile and valuable items.",
  },
  {
    icon: "clock",
    title: "Affordable Pricing",
    text: "Affordable city and long-distance moves with expert packing and custom estimates.",
  },
  {
    icon: "truck",
    title: "Quality Removal/Relocation Services",
    text: "Safe, reliable moving with expert staff, full services, and complete transparency.",
  },
];

export default function WhyChooseUs({
  items = defaultItems,
  eyebrow = "Why Choose Us",
  title = "We are the best moving company in New Zealand",
  subtitle = "We combine local expertise with professional standards to give you a smooth, worry-free relocation.",
  image = "/wp-content/uploads/2023/10/img-01-1.jpg",
}) {
  return (
    <section className="section">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img src={image} alt="National Movers team" className="w-full object-cover" />
          </div>
          <div className="absolute -right-4 -top-4 hidden rounded-2xl bg-brand p-5 text-ink-strong shadow-card sm:block">
            <p className="text-3xl font-extrabold leading-none">10+</p>
            <p className="text-sm font-semibold">Years experience</p>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-8" />
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((it) => (
              <div key={it.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-dark">
                  <Icon name={it.icon} size={24} />
                </span>
                <div>
                  <h3 className="mb-1 text-base font-bold text-ink-strong">{it.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{it.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
