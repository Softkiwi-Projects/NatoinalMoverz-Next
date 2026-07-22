import Link from "next/link";
import { cities as allCities } from "@/data/cities";
import Icon from "@/components/ui/Icon";
import SectionHeading from "./SectionHeading";

export default function CitiesGrid({
  cities = allCities,
  eyebrow = "Where We Move",
  title = "Movers Across New Zealand",
  subtitle = "Local knowledge in every region we serve — from Tauranga to Invercargill.",
  showHeading = true,
}) {
  return (
    <section className="section">
      <div className="container-page">
        {showHeading && (
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-soft"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="map" size={18} className="text-brand" />
                  <h3 className="text-lg font-bold">{c.title}</h3>
                </div>
                <p className="text-sm text-white/80">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
