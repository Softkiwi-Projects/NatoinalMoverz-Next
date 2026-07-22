import LocationHero from "@/components/sections/LocationHero";
import LocationIntro from "@/components/sections/LocationIntro";
import ServicesGrid from "@/components/sections/ServicesGrid";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Stats from "@/components/sections/Stats";
import QualityFocus from "@/components/sections/QualityFocus";
import PlanMove from "@/components/sections/PlanMove";
import { getBlocks } from "@/lib/content";

// Accordion titles are fixed across all location pages; the body copy for
// each comes from the page's own extracted paragraphs (in this order).
const ACCORDION_TITLES = [
  "Experienced Team",
  "Guaranteed Satisfaction",
  "Affordable Pricing",
  "Quality Removal/Relocation Services",
];

export default function CityTemplate({ city }) {
  const blocks = getBlocks(city.slug);

  // Every location page's blocks follow the same shape:
  //   h2 (hero title) → ul (hero bullets) → … → h2 "Leading Movers in {city}"
  //   → 2 intro paragraphs → 4 accordion body paragraphs → services etc.
  const heroTitle =
    blocks[0]?.type === "h2" ? blocks[0].text : `Leading Moving Company ${city.city}`;
  const heroBullets = blocks.find((b) => b.type === "ul")?.items;

  const introTitle =
    blocks.find((b) => b.type === "h2" && b.text.startsWith("Leading Movers in"))?.text ||
    `Leading Movers in ${city.city}`;
  const paras = blocks.filter((b) => b.type === "p").map((b) => b.text);
  const introParagraphs = paras.slice(0, 2);
  const accordionItems = ACCORDION_TITLES.map((title, i) => ({
    title,
    text: paras[2 + i] || "",
  })).filter((it) => it.text);

  return (
    <>
      <LocationHero title={heroTitle} city={city.city} bullets={heroBullets} />

      <LocationIntro
        city={city.city}
        title={introTitle}
        paragraphs={introParagraphs}
        items={accordionItems}
      />

      <ServicesGrid subtitle={`Every kind of move in ${city.city}, handled by specialist teams.`} />

      <WhyChooseUs />

      <Stats />

      <QualityFocus />

      <PlanMove />
    </>
  );
}
