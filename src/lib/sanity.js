/* ============================================================================
   SANITY — client, image URLs and the two queries the blog needs.
   ----------------------------------------------------------------------------
   The project id and dataset are hardcoded on purpose: both are public values
   (they ship in every request the browser makes and are already committed in
   the studio's sanity.config.ts), and an env var for a value that never
   changes is ceremony. The dataset is public, so there is no token anywhere.
   ========================================================================== */

import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanity = createClient({
  projectId: "hnik83nf",
  dataset: "production",
  apiVersion: "2024-10-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(sanity);

/* Returns a builder, so callers chain their own sizing:
   urlFor(post.coverImage).width(1200).height(630).url() */
export const urlFor = (source) => builder.image(source);

/* ------------------------------------------------------------------ queries */

/* `category` is a reference, so it is dereferenced to its title here. Doing it
   in the query means renaming a category in the studio updates every post
   that uses it — nothing stores a copy of the name. */
const CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": category->title,
  publishedAt,
  coverImage
`;

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]
  | order(publishedAt desc){${CARD_FIELDS}}`;

/* metaTitle / metaDescription are optional overrides — only the article page
   needs them, so they stay out of CARD_FIELDS. */
export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  ${CARD_FIELDS},
  metaTitle,
  metaDescription,
  body
}`;

export const SLUGS_QUERY = `*[_type == "post" && defined(slug.current)].slug.current`;

/* Three newest posts, excluding the one being read. */
export const MORE_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && slug.current != $slug]
  | order(publishedAt desc)[0...3]{${CARD_FIELDS}}`;

/* ------------------------------------------------------------------ derived
   Everything below is computed from the seven authored fields so a writer
   never has to fill in a number that can go stale. */

/* Portable Text is an array of blocks; only `block` types carry prose. */
export function readingTime(body) {
  const words = (body ?? [])
    .filter((node) => node?._type === "block")
    .flatMap((node) => node.children ?? [])
    .map((child) => child.text ?? "")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}

/* ---------------------------------------------------------------- headings
   The table of contents and the rendered <h2> ids must agree, so both go
   through the same two functions. */
const blockText = (block) =>
  (block?.children ?? []).map((child) => child.text ?? "").join("");

const slugifyHeading = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const headingId = (block) => slugifyHeading(blockText(block));

/* H2 only. H3s would make the list longer than the article is deep. */
export function tableOfContents(body) {
  return (body ?? [])
    .filter((block) => block?._type === "block" && block.style === "h2")
    .map((block) => ({ id: headingId(block), text: blockText(block) }))
    .filter((heading) => heading.id && heading.text);
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
