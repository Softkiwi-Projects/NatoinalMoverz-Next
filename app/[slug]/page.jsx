import { notFound } from "next/navigation";
import { getService, serviceSlugs } from "@/data/services";
import { getCity, citySlugs } from "@/data/cities";
import { getPost, getAllPosts, getPageContent } from "@/lib/content";
import ServiceTemplate from "@/components/templates/ServiceTemplate";
import CityTemplate from "@/components/templates/CityTemplate";
import PostTemplate from "@/components/templates/PostTemplate";
import { site } from "@/data/site";
import {
  cleanTitle,
  getCanonicalUrl,
  DEFAULT_ROBOTS,
  buildServiceJsonLd,
  buildCityJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  const postSlugs = getAllPosts().map((p) => p.slug);
  return [...serviceSlugs, ...citySlugs, ...postSlugs].map((slug) => ({ slug }));
}

function resolve(slug) {
  const service = getService(slug);
  if (service) return { type: "service", data: service };
  const city = getCity(slug);
  if (city) return { type: "city", data: city };
  const post = getPost(slug);
  if (post) return { type: "post", data: post };
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) return {};

  const { type, data } = r;
  const pageContent = getPageContent(slug);
  const canonicalUrl = getCanonicalUrl(slug);
  const ogImage = data.image
    ? data.image.startsWith("http")
      ? data.image
      : `${site.url}${data.image}`
    : `${site.url}/wp-content/uploads/2025/01/40330.jpg`;

  if (type === "post") {
    const title = cleanTitle(data.title);
    return {
      title,
      description: data.description,
      robots: DEFAULT_ROBOTS,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "article",
        title: `${title} | ${site.name}`,
        description: data.description,
        url: canonicalUrl,
        siteName: site.name,
        locale: "en_NZ",
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        publishedTime: data.published,
        modifiedTime: data.modified || data.published,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${site.name}`,
        description: data.description,
        images: [ogImage],
      },
    };
  }

  // Service or City page
  const title = cleanTitle(pageContent?.title || data.title, data.title);
  const description =
    pageContent?.description ||
    data.excerpt ||
    data.blurb ||
    `${data.title} by National Movers. Reliable, affordable, and professional moving services across New Zealand.`;

  return {
    title,
    description,
    robots: DEFAULT_ROBOTS,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url: canonicalUrl,
      siteName: site.name,
      locale: "en_NZ",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();

  const pageContent = getPageContent(slug);

  if (r.type === "service") {
    const serviceSchema = buildServiceJsonLd(r.data, pageContent);
    const breadcrumbSchema = buildBreadcrumbJsonLd([
      { name: "Home", item: "/" },
      { name: r.data.title, item: `/${slug}/` },
    ]);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ServiceTemplate service={r.data} />
      </>
    );
  }

  if (r.type === "city") {
    const citySchema = buildCityJsonLd(r.data, pageContent);
    const breadcrumbSchema = buildBreadcrumbJsonLd([
      { name: "Home", item: "/" },
      { name: r.data.title, item: `/${slug}/` },
    ]);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <CityTemplate city={r.data} />
      </>
    );
  }

  // Blog post
  const articleSchema = buildArticleJsonLd(r.data);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog/" },
    { name: r.data.title, item: `/${slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PostTemplate post={r.data} />
    </>
  );
}
