import Link from "next/link";
import Icon from "@/components/ui/Icon";

// Page hero/breadcrumb band shown at the top of interior pages —
// mirrors the theme's dark title bar.
export default function TitleBar({ title, subtitle, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(/wp-content/uploads/2023/10/bg-new-03-1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/70" />
      <div className="container-page relative py-16 md:py-20">
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.href || c.label} className="flex items-center gap-2">
              <Icon name="chevron" size={14} className="-rotate-90 text-brand" />
              {c.href ? (
                <Link href={c.href} className="hover:text-brand">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
