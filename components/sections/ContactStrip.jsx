import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Yellow phone / address / email strip with dark circle icons — sits above
// the footer on service pages and the About page.
export default function ContactStrip() {
  return (
    <section className="bg-brand py-8">
      <div className="container-page grid gap-6 sm:grid-cols-3">
        <ContactItem icon="phone" label="Phone" href={site.phone.href}>
          {site.phone.label}
        </ContactItem>
        <ContactItem icon="map" label="Address" href={site.address.href}>
          {site.address.line}
        </ContactItem>
        <ContactItem icon="mail" label="Email" href={`mailto:${site.email}`}>
          {site.email}
        </ContactItem>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, href, children }) {
  return (
    <a href={href} className="flex items-center justify-center gap-4 sm:justify-start lg:justify-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-dark text-brand">
        <Icon name={icon} size={22} />
      </span>
      <span className="leading-snug">
        <b className="block text-ink-strong">{label}</b>
        <span className="text-sm font-medium text-ink-strong/75">{children}</span>
      </span>
    </a>
  );
}
