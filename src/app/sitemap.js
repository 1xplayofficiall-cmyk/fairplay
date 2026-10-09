import { ROUTES, absolute } from "@/lib/seo";
import { POSTS_QUERY, sanity } from "@/lib/sanity";

const LAST_MODIFIED = new Date("2026-09-23T11:06:45+00:00");

/* Async now: the static routes still come from ROUTES, and blog posts are
   appended from Sanity so a published article cannot be missing from the
   sitemap. Each post carries its own publish date rather than the shared one. */
export default async function sitemap() {
  const pages = ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absolute(path),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));

  /* A CMS outage must not fail the whole sitemap — better to ship the static
     routes than to return nothing. */
  let posts = [];
  try {
    posts = await sanity.fetch(POSTS_QUERY);
  } catch {
    posts = [];
  }

  return [
    ...pages,
    ...posts.map((post) => ({
      url: absolute(`/blog/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}
