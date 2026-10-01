import { site } from "@/data/site";

/**
 * Strips duplicate brand suffix (" | National Movers" or " - National Movers")
 * so layout title template `%s | ${site.name}` doesn't duplicate the brand name.
 */
export function cleanTitle(rawTitle, fallback) {
  if (!rawTitle) return fallback || site.name;
  let title = rawTitle.trim();

  // If title is "Quote Form - National Movers", provide a more conversion-friendly title
  if (/^quote\s*form/i.test(title)) {
    return "Get a Free Quote";
  }

  // Remove trailing " - National Movers" or " | National Movers" or " | Movers New Zealand | National Movers"
  title = title
    .replace(/\s*\|\s*Movers\s*New\s*Zealand\s*\|\s*National\s*Movers\s*$/i, "")
    .replace(/\s*(?:\||-|–)\s*National\s*Movers\s*$/i, "")
    .trim();

  return title || fallback || site.name;
}

/**
 * Normalizes any route/pathname to an absolute URL with a trailing slash,
 * perfectly matching `trailingSlash: true` in next.config.mjs.
 */
export function getCanonicalUrl(path = "") {
  const base = site.url.replace(/\/+$/, "");
  const clean = String(path).replace(/^\/+|\/+$/g, "");
  return clean ? `${base}/${clean}/` : `${base}/`;
}

/**
 * Standard indexable robots directive for search engines.
 */
export const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

/**
 * Non-indexable directive for thin/duplicate archives (like tags).
 */
export const NOINDEX_FOLLOW_ROBOTS = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
};

/**
 * BreadcrumbList Schema generator.
 * Items format: [{ name: "Home", item: "/" }, { name: "Services", item: "/services/" }]
 */
export function buildBreadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.item ? getCanonicalUrl(crumb.item) : undefined,
    })),
  };
}

/**
 * Global MovingCompany & LocalBusiness Schema.
 */
export function buildGlobalLocalBusinessJsonLd() {
  const base = site.url.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MovingCompany", "LocalBusiness"],
        "@id": `${base}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: `${base}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${base}/#logo`,
          url: `${base}${site.logo}`,
          caption: site.name,
        },
        image: `${base}/wp-content/uploads/2025/01/40330.jpg`,
        description: site.description,
        telephone: site.phone.label,
        email: site.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "36a Sixteenth Avenue",
          addressLocality: "Tauranga",
          addressRegion: "Bay of Plenty",
          postalCode: "3112",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -37.7082,
          longitude: 176.1523,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "07:00",
            closes: "19:00",
          },
        ],
        areaServed: [
          { "@type": "City", name: "Tauranga" },
          { "@type": "City", name: "Auckland" },
          { "@type": "City", name: "Hamilton" },
          { "@type": "City", name: "Wellington" },
          { "@type": "City", name: "Christchurch" },
          { "@type": "City", name: "Rotorua" },
          { "@type": "City", name: "North Shore" },
          { "@type": "City", name: "Thames" },
          { "@type": "City", name: "Invercargill" },
          { "@type": "Country", name: "New Zealand" },
        ],
        sameAs: (site.social || []).map((s) => s.href).filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: site.name,
        description: site.description,
        publisher: {
          "@id": `${base}/#organization`,
        },
        inLanguage: "en-NZ",
      },
    ],
  };
}

/**
 * Service Schema generator for service landing pages.
 */
export function buildServiceJsonLd(service, pageContent) {
  const base = site.url.replace(/\/+$/, "");
  const canonicalUrl = getCanonicalUrl(service.slug);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: cleanTitle(pageContent?.title || service.title),
    description: pageContent?.description || service.excerpt,
    provider: {
      "@type": "MovingCompany",
      name: site.name,
      url: `${base}/`,
      telephone: site.phone.label,
    },
    areaServed: {
      "@type": "Country",
      name: "New Zealand",
    },
    url: canonicalUrl,
    image: service.image ? (service.image.startsWith("http") ? service.image : `${base}${service.image}`) : undefined,
  };
}

/**
 * City / Location Schema generator.
 */
export function buildCityJsonLd(city, pageContent) {
  const base = site.url.replace(/\/+$/, "");
  const canonicalUrl = getCanonicalUrl(city.slug);
  return {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "LocalBusiness"],
    name: `${site.name} ${city.city}`,
    description: pageContent?.description || city.blurb,
    url: canonicalUrl,
    telephone: site.phone.label,
    image: city.image ? (city.image.startsWith("http") ? city.image : `${base}${city.image}`) : undefined,
    areaServed: {
      "@type": "City",
      name: city.city,
    },
    parentOrganization: {
      "@type": "MovingCompany",
      name: site.name,
      url: `${base}/`,
    },
  };
}

/**
 * BlogPosting Article Schema generator.
 */
export function buildArticleJsonLd(post) {
  const base = site.url.replace(/\/+$/, "");
  const canonicalUrl = getCanonicalUrl(post.slug);
  const imageUrl = post.image ? (post.image.startsWith("http") ? post.image : `${base}${post.image}`) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: post.published,
    dateModified: post.modified || post.published,
    author: {
      "@type": "Organization",
      name: site.name,
      url: `${base}/`,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: `${base}/`,
      logo: {
        "@type": "ImageObject",
        url: `${base}${site.logo}`,
      },
    },
  };
}
