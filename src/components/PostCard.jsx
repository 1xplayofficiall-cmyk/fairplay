import Link from "next/link";

import { formatDate, urlFor } from "@/lib/sanity";

/* Used by both the index and the "more reading" strip on a post, so it lives
   here rather than being written twice. Builds on `.card` to inherit the
   pointer-tracked light and hover treatment the rest of the site uses. */
export default function PostCard({ post }) {
  const cover = post.coverImage
    ? urlFor(post.coverImage).width(720).height(420).fit("crop").auto("format").url()
    : null;

  return (
    <Link className="card post-card" href={`/blog/${post.slug}`}>
      <span className="tile__edge" aria-hidden="true" />

      {cover ? (
        <span className="post-card__media">
          {/* Plain <img>: Sanity's CDN has already resized and re-encoded this,
              so putting next/image in front of it would optimise it twice and
              need a remotePatterns entry for nothing. */}
          <img
            src={cover}
            alt={post.coverImage?.alt ?? ""}
            width={720}
            height={420}
            loading="lazy"
            decoding="async"
          />
        </span>
      ) : null}

      <span className="post-card__body">
        <span className="post-card__meta">
          {post.category ? <span className="tag">{post.category}</span> : null}
          <span className="index">{formatDate(post.publishedAt)}</span>
        </span>

        <span className="post-card__title">{post.title}</span>
        <span className="t-small">{post.excerpt}</span>
      </span>
    </Link>
  );
}
