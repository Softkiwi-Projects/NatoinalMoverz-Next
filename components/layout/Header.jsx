"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { primaryNav } from "@/data/nav";
import Icon from "@/components/ui/Icon";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    // Shadow appears once the top utility bar has scrolled out of view.
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  // `display: contents` so the sticky nav bar below sticks relative to the
  // whole page (body), not just the short header region — this lets the top
  // utility bar scroll away while only the nav bar stays fixed at the top.
  return (
    <header className="contents">
      {/* Top utility bar — full width, scrolls away on scroll */}
      <div className="hidden bg-topbar text-white hdr:block">
        <div className="flex h-[52px] items-stretch">
          <div className="flex items-center gap-5 bg-brand px-8 text-ink-strong">
            {site.social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="transition-transform hover:-translate-y-0.5"
              >
                <Icon name={s.icon} size={17} strokeWidth={s.icon === "x" ? 2.4 : 2} />
              </a>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center gap-10 px-8 text-[15px] hdr:justify-end hdr:gap-14 hdr:pr-[6%]">
            <a href={site.phone.href} className="flex items-center gap-2.5 font-semibold hover:text-brand">
              <Icon name="phone" size={18} className="text-brand" /> {site.phone.label}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 font-semibold hover:text-brand">
              <Icon name="mail" size={18} className="text-brand" /> {site.email}
            </a>
            <span className="flex items-center gap-2.5 font-semibold">
              <Icon name="map" size={18} className="text-brand" /> {site.address.line}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky nav bar — only this stays pinned to the top */}
      <div
        className={`sticky top-0 z-50 border-b border-surface-border bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        {/* Content constrained to a centered 1200px container */}
        <div className="mx-auto flex h-20 max-w-container items-center">
          {/* Logo tile — fixed size, no shrink-on-scroll (smooth, no reflow) */}
          <Link
            href="/"
            className="flex shrink-0 items-center justify-center px-6"
            aria-label={site.name}
          >
            <Image
              src={site.logo}
              alt={site.name}
              width={190}
              height={64}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav — items aligned to the right of the nav area */}
          <nav className="hidden flex-1 items-center justify-end gap-1 pr-8 hdr:flex">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.children) {
                const childActive = item.children.some((c) => isActive(pathname, c.href));
                return (
                  <div key={item.label} className="group relative flex items-center">
                    <button
                      className={`flex items-center gap-2 px-4  text-sm font-bold leading-none transition-colors ${
                        childActive ? "text-brand-light" : "text-ink hover:text-brand-light"
                      }`}
                    >
                      <Icon name={item.icon} size={18} className="block shrink-0" />
                      <span className="leading-none">{item.label}</span>
                    </button>
                    <div className="invisible absolute left-0 top-full min-w-[240px] translate-y-2 rounded-xl bg-brand-dark p-2 opacity-0 shadow-card transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`block rounded-lg px-4 py-2.5 font-dropdown text-xs font-medium uppercase leading-4 tracking-wide transition-colors ${
                            isActive(pathname, c.href)
                              ? "text-dropdownActive"
                              : "text-white hover:bg-white/10 hover:text-brand"
                          }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 text-sm font-bold leading-none transition-colors ${
                    active ? "text-brand-light" : "text-ink hover:text-brand-light"
                  }`}
                >
                  <Icon name={item.icon} size={18} className="block shrink-0" />
                  <span className="leading-none">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA block — solid yellow, at the container's right edge */}
          <Link
            href="/quote-form"
            className="hidden shrink-0 items-center bg-brand px-9 text-sm font-extrabold uppercase tracking-wide text-ink-strong transition-colors hover:bg-brand-light sm:flex h-[60px]"
          >
            Get a free quote
          </Link>

          <button
            className="ml-auto flex items-center px-5 hdr:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={28} />
          </button>
        </div>

        {/* Mobile menu — drops down from the sticky bar */}
        {mobileOpen && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-surface-border bg-white hdr:hidden">
            <nav className="container-page flex flex-col py-3">
              {primaryNav.map((item) => {
                if (item.children) {
                  const open = openGroup === item.label;
                  return (
                    <div key={item.label} className="border-b border-surface-border/60">
                      <button
                        onClick={() => setOpenGroup(open ? null : item.label)}
                        className="flex w-full items-center justify-between py-3 text-[15px] font-semibold text-ink"
                      >
                        <span className="flex items-center gap-2">
                          <Icon name={item.icon} size={18} className="block shrink-0" />
                          <span className="leading-none">{item.label}</span>
                        </span>
                        <Icon name="chevron" size={16} className={open ? "rotate-180" : ""} />
                      </button>
                      {open && (
                        <div className="flex flex-col pb-2">
                          {item.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              className={`py-2 pl-4 text-sm font-semibold hover:text-brand-light ${
                                isActive(pathname, c.href) ? "text-dropdownActive" : "text-ink-soft"
                              }`}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 border-b border-surface-border/60 py-3 text-[15px] font-semibold hover:text-brand-light ${
                      isActive(pathname, item.href) ? "text-brand-light" : "text-ink"
                    }`}
                  >
                    <Icon name={item.icon} size={18} className="block shrink-0" />
                    <span className="leading-none">{item.label}</span>
                  </Link>
                );
              })}
              <Link href="/quote-form" className="btn-primary mt-4 w-full">
                Get a free quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
