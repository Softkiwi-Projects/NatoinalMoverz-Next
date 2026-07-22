import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function ServiceCard({ service }) {
  const href = service.href || `/${service.slug}`;
  return (
    <div className="group flex flex-col">
      {/* Framed image */}
      <Link href={href} className="block overflow-hidden border border-surface-border bg-white">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <h3 className="mt-5 text-xl font-bold text-ink-strong">
        <Link href={href} className="transition-colors hover:text-brand-dark">
          {service.title}
        </Link>
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft line-clamp-3">{service.excerpt}</p>

      <Link
        href={href}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark hover:text-white"
      >
        Read More
        <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
