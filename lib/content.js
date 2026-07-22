import pages from "@/data/pages.json";
import posts from "@/data/posts.json";
import taxonomy from "@/data/taxonomy.json";

// ---- Landing pages (home, services, cities, about, contact, quote) ----
export function getPageContent(route) {
  return pages[route] || null;
}

// A page's body copy as ordered content blocks (headings, paragraphs, lists).
export function getBlocks(route) {
  return pages[route]?.blocks || [];
}

// ---- Blog posts ----
export function getAllPosts() {
  return posts;
}

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

export function getRecentPosts(limit = 3, excludeSlug = null) {
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function getRelatedPosts(post, limit = 3) {
  if (!post) return getRecentPosts(limit);
  const tagSlugs = new Set((post.tags || []).map((t) => t.slug));
  const scored = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: (p.tags || []).filter((t) => tagSlugs.has(t.slug)).length,
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.post);
}

// ---- Taxonomy (categories & tags) ----
export function getCategories() {
  return taxonomy.categories;
}
export function getTags() {
  return taxonomy.tags;
}
export function getCategory(slug) {
  return taxonomy.categories.find((c) => c.slug === slug) || null;
}
export function getTag(slug) {
  return taxonomy.tags.find((t) => t.slug === slug) || null;
}
export function getPostsByCategory(slug) {
  return posts.filter((p) => (p.categories || []).some((c) => c.slug === slug));
}
export function getPostsByTag(slug) {
  return posts.filter((p) => (p.tags || []).some((t) => t.slug === slug));
}

// ---- Misc helpers ----
export function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
