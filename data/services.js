// Service offerings. `slug` maps to /[slug] routes and drives the Services menu.
// Images mirror the original site's "Our Quality Services" tiles.
export const services = [
  {
    slug: "house-moving-service",
    title: "House Moving Service",
    menuTitle: "House Moving Service",
    icon: "home",
    excerpt:
      "Get services from professional household movers who are skilled in moving your full house without a hitch.",
    image: "/wp-content/uploads/2025/01/2149103441.jpg",
    features: [
      "Full-service packing & unpacking",
      "Furniture protection & assembly",
      "Local and long-distance moves",
    ],
  },
  {
    slug: "kitchen-moving-service",
    title: "Kitchen Moving Service",
    menuTitle: "Kitchen Moving Service",
    icon: "kitchen",
    excerpt:
      "Relocating your kitchen can be a daunting task, but with National Movers, it becomes a hassle-free experience.",
    image: "/wp-content/uploads/2025/03/kitchen-move.jpg",
    features: [
      "Appliance disconnect & reconnect",
      "Fragile glassware packing",
      "Damage-free heavy lifting",
    ],
  },
  {
    slug: "furniture-moving-service",
    title: "Furniture Moving Service",
    menuTitle: "Furniture Moving Service",
    icon: "sofa",
    excerpt:
      "Are you planning relocation within Tauranga? Are you worried about how you will take all your furniture along?",
    image: "/wp-content/uploads/2025/01/2149312723.jpg",
    features: [
      "Dismantle & reassemble",
      "Protective wrapping & padding",
      "Careful stair & tight-space moves",
    ],
  },
  {
    slug: "office-relocation-service",
    title: "Office Relocation Service",
    menuTitle: "Office Relocation Tauranga",
    icon: "office",
    excerpt:
      "Relocating your office can be tough, but with National Movers, your office move to Tauranga will be smooth.",
    image: "/wp-content/uploads/2025/01/66036.jpg",
    features: [
      "After-hours & weekend moves",
      "Secure equipment handling",
      "Phased, low-downtime planning",
    ],
  },
  {
    slug: "piano-moving-service",
    title: "Piano Moving Service",
    menuTitle: "Piano Moving Service",
    icon: "piano",
    excerpt:
      "We provide expert piano moving services, ensuring safe and damage-free transportation with specialized equipment and trained professionals.",
    image: "/wp-content/uploads/2025/01/piano-e1752153923895.jpg",
    features: [
      "Upright & grand piano experts",
      "Specialised equipment & straps",
      "Climate-aware transport",
    ],
  },
  {
    slug: "two-men-and-a-van-tauranga",
    title: "Man and a Van",
    menuTitle: "Man And A Van",
    icon: "van",
    excerpt:
      "Flexible, affordable two men and a van service — perfect for small moves, single items, and long-distance runs.",
    image: "/wp-content/uploads/2025/01/long-distance.jpg",
    features: [
      "Same-day availability",
      "Ideal for apartments & studios",
      "Hourly, pay-as-you-go rates",
    ],
  },
];

export const serviceSlugs = services.map((s) => s.slug);
export const getService = (slug) => services.find((s) => s.slug === slug) || null;

// The homepage "Our Quality Services" grid shows the 5 core service pages
// plus a "Long Distance Move" tile (a promo card in the original theme with
// no dedicated page — it links to the quote form).
export const homeServices = [
  ...services.filter((s) => s.slug !== "two-men-and-a-van-tauranga"),
  {
    slug: "long-distance-move",
    title: "Long Distance Move",
    icon: "van",
    href: "/quote-form",
    excerpt:
      "We specialize in safe and secure long-distance moving services to ensure your belongings reach their destination with care.",
    image: "/wp-content/uploads/2025/01/long-distance.jpg",
  },
];
