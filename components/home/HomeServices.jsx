import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { HomeHeading } from "./shared";

// Photo cards with the title set over a navy gradient, excerpt + yellow pill CTA.
export default function HomeServices({ services }) {
  return (
    <section id="services" className="section-bds bg-soft">
      <div className="container-bds">
        <HomeHeading
          eyebrow="Our Services"
          title="Our **Quality** Services"
          subtitle="We understand that every move is unique, so we offer a range of services to fit your requirements."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const href = s.href || `/${s.slug}`;
            return (
              <Link
                key={s.slug}
                href={href}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition hover:shadow-xl hover:ring-brand"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 right-5 text-xl font-extrabold text-white">{s.title}</h3>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-sm leading-relaxed">{s.excerpt}</p>
                  <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-navy transition-colors group-hover:bg-brand-hover">
                    Read More <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
