import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";
import { Emphasis } from "./shared";

const items = [
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

// Image left with a yellow corner badge, pill eyebrow + copy + icon list right.
export default function HomeAbout() {
  return (
    <section className="section-bds bg-white">
      <div className="container-bds grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <img
              src="/wp-content/uploads/2023/10/img-01-1.jpg"
              alt="National Movers team"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Icon name="map" size={16} className="text-brand" />
                Local and nationwide moves across New Zealand
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 hidden rounded-2xl bg-brand px-4 py-3 shadow-lg sm:block">
            <p className="text-xs font-extrabold uppercase tracking-wider text-navy">1200+</p>
            <p className="text-xs font-medium text-navy/80">Happy Customers</p>
          </div>
        </div>

        <div>
          <span className="pill-yellow">Why Choose Us</span>
          <h2 className="h2-bds mt-4">
            <Emphasis text="We are the best **moving company** in New Zealand" />
          </h2>
          <p className="mt-6 text-pretty leading-relaxed">
            We combine local expertise with professional standards to give you a smooth, worry-free relocation.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {items.map((it) => (
              <div key={it.title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/25 text-navy">
                  <Icon name={it.icon} size={22} />
                </span>
                <div>
                  <h3 className="mb-1 text-base font-bold text-navy">{it.title}</h3>
                  <p className="text-sm leading-relaxed">{it.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/quote-form" className="btn-yellow">
              Get a Free Quote <Icon name="arrow" size={16} />
            </Link>
            <a href={site.phone.href} className="btn-navy-outline">
              <Icon name="phone" size={16} /> {site.phone.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
