import { SITE, absolute } from "@/lib/seo";

/* Nothing on this site is private, so the rules are deliberately plain — a
   robots.txt full of speculative Disallow lines is the usual way pages end up
   accidentally deindexed. The one thing worth blocking is Next's build output
   directory, which serves no crawlable content but does answer requests.

   `host` is a Yandex directive naming the canonical hostname; other engines
   ignore it. Google takes the canonical from the <link rel="canonical"> tags
   that lib/seo.js emits instead. */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: SITE.url,
  };
}
