import { notFound } from "next/navigation";
import { getService, serviceSlugs } from "@/data/services";
import { getCity, citySlugs } from "@/data/cities";
import { getPost, getAllPosts } from "@/lib/content";
import ServiceTemplate from "@/components/templates/ServiceTemplate";
import CityTemplate from "@/components/templates/CityTemplate";
import PostTemplate from "@/components/templates/PostTemplate";
import { site } from "@/data/site";

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
  if (type === "post") {
    return {
      title: data.title,
      description: data.description,
      alternates: { canonical: `/${slug}` },
      openGraph: {
        type: "article",
        title: data.title,
        description: data.description,
        images: data.image ? [{ url: site.url + data.image }] : undefined,
        publishedTime: data.published,
        modifiedTime: data.modified,
      },
    };
  }
  return {
    title: data.title,
    description: data.excerpt || data.blurb,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  if (r.type === "service") return <ServiceTemplate service={r.data} />;
  if (r.type === "city") return <CityTemplate city={r.data} />;
  return <PostTemplate post={r.data} />;
}
