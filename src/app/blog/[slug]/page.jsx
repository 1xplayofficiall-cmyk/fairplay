import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import { JsonLd, blogPostingSchema, breadcrumbSchema, graph, pageMeta } from "@/lib/seo";
import {
  MORE_POSTS_QUERY,
  POST_QUERY,
  SLUGS_QUERY,
  formatDate,
  headingId,
  readingTime,
  sanity,
  tableOfContents,
  urlFor,
} from "@/lib/sanity";
import PostCard from "@/components/PostCard";
import { Notice, Section } from "@/components/ui";

export const revalidate = 60;

/* Prerender every post at build time; new ones are picked up by ISR. */
export async function generateStaticParams() {
  const slugs = await sanity.fetch(SLUGS_QUERY);
  return (slugs ?? []).map((slug) => ({ slug }));
}

const ogImage = (post) =>
  post?.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).fit("crop").auto("format").url()
    : null;

/* `params` is a Promise in Next 16 — it has to be awaited in both of these. */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await sanity.fetch(POST_QUERY, { slug });
  const path = `/blog/${slug}`;

  if (!post) {
    return pageMeta({
      title: "Article not found",
      description: "This article is no longer available.",
      path,
    });
  }

  /* An explicit metaTitle is used verbatim — if someone has tuned it to 58
     characters, appending " | FairPlay" would defeat the point. Without one,
     the post title goes through the usual template. */
  const base = pageMeta({
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description: post.metaDescription || post.excerpt,
    path,
  });
  const image = ogImage(post);

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      ...(image
        ? { images: [{ url: image, width: 1200, height: 630, alt: post.coverImage?.alt ?? post.title }] }
        : {}),
    },
    twitter: { ...base.twitter, ...(image ? { images: [image] } : {}) },
  };
}

/* How Portable Text maps onto the design system. Anything a writer can produce
   in the studio needs an entry here or a rule in blog.css. */
const components = {
  types: {
    /* @sanity/table shape: { rows: [{ _key, cells: [string] }] }.
       The plugin has no header concept, so the first row is treated as one —
       which is what a writer filling in a table expects. */
    table: ({ value }) => {
      const [head, ...body] = value?.rows ?? [];
      if (!head) return null;
      return (
        <div className="post-table">
          <table>
            <thead>
              <tr>
                {(head.cells ?? []).map((cell, i) => (
                  <th key={i} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row) => (
                <tr key={row._key}>
                  {(row.cells ?? []).map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    image: ({ value }) => (
      <figure>
        <img
          src={urlFor(value).width(1400).auto("format").url()}
          alt={value?.alt ?? ""}
          loading="lazy"
          decoding="async"
        />
        {value?.alt ? <figcaption>{value.alt}</figcaption> : null}
      </figure>
    ),
  },
  block: {
    /* Ids come from the same helper the contents list uses, so the anchors
       cannot drift from the headings they point at. */
    h2: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
  },
  marks: {
    /* Internal links stay client-routed; external ones get the safety rel. */
    link: ({ value, children }) => {
      const href = value?.href ?? "";
      if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await sanity.fetch(POST_QUERY, { slug });

  if (!post) notFound();

  const more = await sanity.fetch(MORE_POSTS_QUERY, { slug });
  const toc = tableOfContents(post.body);
  const path = `/blog/${slug}`;
  const cover = post.coverImage
    ? urlFor(post.coverImage).width(1600).height(900).fit("crop").auto("format").url()
    : null;

  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path },
  ]);

  return (
    <main id="main">
      <JsonLd
        schema={graph(
          crumbs,
          blogPostingSchema({
            /* headline stays the real article title; only the description
               follows the SEO override. */
            title: post.title,
            description: post.metaDescription || post.excerpt,
            path,
            image: ogImage(post),
            publishedAt: post.publishedAt,
            breadcrumb: crumbs,
          })
        )}
      />

      {/* One centred column the whole way down. An article does not need the
          marketing hero's two-column split or an aside repeating its own
          standfirst back at the reader. */}
      <header className="post-head">
        <div className="shell post-measure">
          {/* Category is guarded: a post saved before categories became
              documents resolves to null until it is re-picked. */}
          <nav className="page-hero__route" data-anim="fade" data-on="load">
            <Link href="/blog">Blog</Link>
            {post.category ? (
              <>
                <span>/</span>
                <span>{post.category}</span>
              </>
            ) : null}
          </nav>

          <h1 className="post-title" data-anim="split" data-on="load" data-delay="0.12">
            {post.title}
          </h1>

          <p className="post-standfirst" data-anim="up" data-on="load" data-delay="0.28">
            {post.excerpt}
          </p>

          <div className="post-meta" data-anim="fade" data-on="load" data-delay="0.38">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="post-meta__dot" aria-hidden="true" />
            <span>{readingTime(post.body)} min read</span>
          </div>
        </div>
      </header>

      <Section shell={false}>
        <div className="shell post-layout" data-pin-container>
          {/* Fills the left gutter with something a reader can use. Hidden
              below two headings — a contents list for one section is noise. */}
          {toc.length >= 2 ? (
            <aside className="post-toc" data-pin-y data-anim="fade">
              <span className="post-toc__title">On this page</span>
              <nav data-toc>
                {toc.map((heading) => (
                  <a key={heading.id} href={`#${heading.id}`}>
                    {heading.text}
                  </a>
                ))}
              </nav>
            </aside>
          ) : null}

          <div className="post-main">
            {cover ? (
              <figure className="post-cover" data-anim="scale">
                <img
                  src={cover}
                  alt={post.coverImage?.alt ?? ""}
                  width={1600}
                  height={900}
                  /* Above the fold on an article — never lazy-load the cover. */
                  fetchPriority="high"
                  decoding="async"
                />
              </figure>
            ) : null}

            <article className="post-body" data-anim="up">
              <PortableText value={post.body} components={components} />

              <hr className="rule rule--brand post-body__end" />
              <Link className="link" href="/blog">
                All articles
              </Link>
            </article>
          </div>
        </div>
      </Section>

      {more.length ? (
        <Section band="raise">
          <h2 className="eyebrow eyebrow--o post-more__title">Keep reading</h2>
          <div className="grid cols-3" data-anim="stagger" data-stagger="0.06">
            {more.map((item) => (
              <PostCard key={item._id} post={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tight>
        <Notice title="Play responsibly">
          <p>
            This article is explanatory and is not betting advice, a prediction, or a guarantee of
            any outcome. Betting and casino games involve financial risk. Only take part where it
            is legally permitted in your location, set your own limits, and never stake money you
            cannot afford to lose.
          </p>
        </Notice>
      </Section>
    </main>
  );
}
