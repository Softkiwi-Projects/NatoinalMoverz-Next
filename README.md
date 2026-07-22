# National Movers — Next.js

A real, component-driven rebuild of the National Movers website using the
Next.js App Router, React Server Components, and Tailwind CSS. This replaces the
previous "HTML shell" build (which injected scraped WordPress markup via
`dangerouslySetInnerHTML`) with genuine, reusable React components and
file-based routing.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Architecture

```
app/                      File-based routes (App Router)
  layout.jsx              Root layout: fonts, <Header/>, <Footer/>
  page.jsx                Home page
  about-us/               Static route
  contacts/               Static route
  quote-form/             Static route
  blog/                   Blog index
  [slug]/                 Services + cities + blog posts (generateStaticParams)
  category/[slug]/        Category archives
  tag/[slug]/             Tag archives
  sitemap.js, robots.js   SEO endpoints

components/
  ui/                     Primitives: Icon, Button
  layout/                 Header, Footer, TitleBar, BackToTop
  sections/               Hero, ServicesGrid, WhyChooseUs, ProcessSteps,
                          Stats, Testimonials, QuoteForm, BlogGrid, PostCard,
                          CitiesGrid, ContentBlocks, SectionHeading, CTA
  templates/              ServiceTemplate, CityTemplate, PostTemplate,
                          ArchiveTemplate

data/                     Single source of truth
  site.js                 Brand + contact config
  nav.js                  Navigation (derived from services/cities)
  services.js             Service catalogue
  cities.js               Location pages
  posts.json              Blog posts (title, meta, taxonomy, content blocks)
  taxonomy.json           Categories & tags
  pages.json              Landing-page body copy as content blocks

lib/content.js            Data-access helpers
```

## How content works

Page body copy was extracted from the original site into ordered **content
blocks** (`{ type: "h2" | "h3" | "p" | "ul" | "ol", ... }`) and is rendered by
the `<ContentBlocks />` component as real React elements — not raw HTML. All
brand colours, fonts, services, cities, and navigation are data-driven, so the
menu and pages never drift out of sync.

Design tokens (brand `#ffd332`, dark `#14212a`, fonts Nunito / Nunito Sans /
Biryani) are defined in `tailwind.config.js`.
