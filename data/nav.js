import { services, getService } from "./services";
import { cities, getCity } from "./cities";

// Exact submenu order taken from the original theme's #site-navigation markup.
const LOCATIONS_ORDER = [
  "tauranga-movers",
  "invercargill-movers",
  "wellington-movers",
  "northshore-movers",
  "christchurch-movers",
  "rotorua-movers",
  "thames-movers",
  "hamilton-movers",
  "auckland-movers",
];

const SERVICES_ORDER = [
  "house-moving-service",
  "office-relocation-service",
  "two-men-and-a-van-tauranga",
  "kitchen-moving-service",
  "furniture-moving-service",
  "piano-moving-service",
];

// Primary navigation — labels, order, and icons mirror the original
// #site-navigation markup (fa-home, fa-truck, fa-map-marker, fa-align-justify,
// fa-sticky-note, fa-envelope) so the rebuilt menu matches 1:1.
export const primaryNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About Us", href: "/about-us", icon: "truck" },
  {
    label: "Locations",
    href: "#",
    icon: "map",
    children: LOCATIONS_ORDER.map((slug) => {
      const c = getCity(slug);
      return { label: c.title, href: `/${c.slug}` };
    }),
  },
  {
    label: "Services",
    href: "#",
    icon: "menu",
    children: [
      ...SERVICES_ORDER.map((slug) => {
        const s = getService(slug);
        return { label: s.menuTitle, href: `/${s.slug}` };
      }),
      // "Long Distance Move" was a placeholder link (href="#") in the
      // original menu with no dedicated page — point it at the quote
      // form instead of leaving a dead link.
      { label: "Long Distance Move", href: "/quote-form" },
    ],
  },
  { label: "Blog", href: "/blog", icon: "clipboard" },
  { label: "Contacts", href: "/contacts", icon: "mail" },
];

// Footer link columns.
export const footerNav = [
  {
    heading: "Services",
    links: services.slice(0, 5).map((s) => ({ label: s.menuTitle, href: `/${s.slug}` })),
  },
  {
    heading: "Locations",
    links: cities
      .filter((c) =>
        [
          "christchurch-movers",
          "thames-movers",
          "hamilton-movers",
          "auckland-movers",
          "invercargill-movers",
          "wellington-movers",
        ].includes(c.slug),
      )
      .map((c) => ({ label: c.title, href: `/${c.slug}` })),
  },
];
