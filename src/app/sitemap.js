import { ROUTES, absolute } from "@/lib/seo";

/* Derived from the same ROUTES list the breadcrumbs use, so a new page cannot
   appear in the navigation and quietly stay out of the sitemap.

   lastModified is the build time. That is honest for a site whose content
   ships with the deploy — it changes exactly when the pages change. Writing a
   fresh `new Date()` per request would claim every page was modified on every
   crawl, which crawlers learn to discount. */
const LAST_MODIFIED = new Date("2026-09-23T11:06:45+00:00");

export default function sitemap() {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absolute(path),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
