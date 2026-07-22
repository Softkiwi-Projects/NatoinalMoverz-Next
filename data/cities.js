// Location / city landing pages. Each maps to /[slug]-movers style routes.
export const cities = [
  {
    slug: "tauranga-movers",
    city: "Tauranga",
    title: "Tauranga Movers",
    image: "/wp-content/uploads/2025/01/2149103441.jpg",
    blurb: "Our home base — trusted local movers across the Bay of Plenty.",
  },
  {
    slug: "auckland-movers",
    city: "Auckland",
    title: "Auckland Movers",
    image: "/wp-content/uploads/2025/01/2149312723.jpg",
    blurb: "Same-day movers for fast, affordable relocations across Auckland.",
  },
  {
    slug: "hamilton-movers",
    city: "Hamilton",
    title: "Hamilton Movers",
    image: "/wp-content/uploads/2025/01/40330.jpg",
    blurb: "Reliable house and office moving throughout the Waikato.",
  },
  {
    slug: "wellington-movers",
    city: "Wellington",
    title: "Wellington Movers",
    image: "/wp-content/uploads/2025/01/66036.jpg",
    blurb: "Careful, efficient moves across the capital and Hutt Valley.",
  },
  {
    slug: "christchurch-movers",
    city: "Christchurch",
    title: "Christchurch Movers",
    image: "/wp-content/uploads/2023/10/img-01-1.jpg",
    blurb: "Professional movers serving Christchurch and Canterbury.",
  },
  {
    slug: "rotorua-movers",
    city: "Rotorua",
    title: "Rotorua Movers",
    image: "/wp-content/uploads/2023/10/img-02.jpg",
    blurb: "Local expertise for stress-free Rotorua relocations.",
  },
  {
    slug: "northshore-movers",
    city: "North Shore",
    title: "Northshore Movers",
    image: "/wp-content/uploads/2023/10/img-05.jpg",
    blurb: "Trusted moving services across Auckland's North Shore.",
  },
  {
    slug: "thames-movers",
    city: "Thames",
    title: "Thames Movers",
    image: "/wp-content/uploads/2025/01/long-distance.jpg",
    blurb: "Coromandel and Thames moves handled with care.",
  },
  {
    slug: "invercargill-movers",
    city: "Invercargill",
    title: "Invercargill Movers",
    image: "/wp-content/uploads/2025/01/office-730681_1280.jpg",
    blurb: "Southland's dependable choice for home and business moves.",
  },
];

export const citySlugs = cities.map((c) => c.slug);
export const getCity = (slug) => cities.find((c) => c.slug === slug) || null;
