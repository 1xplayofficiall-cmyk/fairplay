import { ROUTES, absolute } from "@/lib/seo";


const LAST_MODIFIED = new Date("2026-09-23T11:06:45+00:00");

export default function sitemap() {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absolute(path),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
