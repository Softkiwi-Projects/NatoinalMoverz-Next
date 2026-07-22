import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { footerNav } from "@/data/nav";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const year = Math.max(new Date().getFullYear(), site.copyrightStart);
  return (
    <footer className="mt-auto bg-brand-dark text-white/75">
      {/* CTA strip */}
      <div className="bg-brand">
        <div className="container-page flex flex-col items-center justify-between gap-6 py-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-ink-strong md:text-3xl">
              Ready to move? Get your free quote today.
            </h2>
            <p className="mt-1 font-semibold text-ink-strong/80">
              Fast, friendly, and fully insured moving across New Zealand.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/quote-form" className="btn-dark">
              Get free Quote
            </Link>
            <a href={site.phone.href} className="btn-outline">
              <Icon name="phone" size={16} /> {site.phone.label}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src={site.logo}
            alt={site.name}
            width={190}
            height={54}
            className="mb-5 h-24 w-auto object-contain "
          />
          <p className="text-sm leading-relaxed">
            National Movers offers expert packing and moving services, providing skilled
            professionals with the right tools, protective materials, and equipment to ensure a
            smooth and secure relocation experience.
          </p>
          <div className="mt-5 flex gap-3">
            {site.social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand hover:text-ink-strong"
              >
                <Icon name={s.icon} size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerNav.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-5 text-lg font-bold text-white">{col.heading}</h3>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">Contact Info</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Icon name="phone" size={18} className="mt-0.5 text-brand" />
              <a href={site.phone.href} className="hover:text-brand">
                {site.phone.label}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="mail" size={18} className="mt-0.5 text-brand" />
              <a href={`mailto:${site.email}`} className="hover:text-brand">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="map" size={18} className="mt-0.5 text-brand" />
              <span>{site.address.line}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 md:flex-row">
          <p>
            Copyright © {year} {site.name}. All rights reserved.
          </p>
          <p>Managed By {site.managedBy}</p>
        </div>
      </div>
    </footer>
  );
}
