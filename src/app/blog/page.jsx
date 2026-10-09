import { JsonLd, breadcrumbSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";
import { POSTS_QUERY, sanity } from "@/lib/sanity";
import PostCard from "@/components/PostCard";
import { Btn, Notice, PageHero, Section } from "@/components/ui";

export const metadata = pageMeta({
  title: "Betting Blog | Guides, Markets & How-To Articles",
  description:
    "Guides and explainers on sports betting and casino games — how markets work, how odds are read, and what to check before you play.",
  path: "/blog",
});

export const revalidate = 60;

const crumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
]);

export default async function BlogPage() {
  const posts = await sanity.fetch(POSTS_QUERY);

  return (
    <main id="main">
      <JsonLd
        schema={graph(
          crumbs,
          webPageSchema({
            title: metadata.title,
            description: metadata.description,
            path: "/blog",
            breadcrumb: crumbs,
          })
        )}
      />

      <PageHero
        route={<span>Blog</span>}
        kicker="FairPlay Blog"
        title="Guides, markets and how it all works"
        sub="Plain explanations of betting markets, odds and casino games — written to be read before you stake anything."
      />

      <Section>
        {posts.length ? (
          <div className="grid cols-3" data-anim="stagger" data-stagger="0.06">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="post-empty" data-anim="up">
            <span className="eyebrow eyebrow--o">Nothing published yet</span>
            <p className="t-body">
              The first articles are on the way. In the meantime, the odds explainer and the FAQ
              cover the basics.
            </p>
            <div className="row">
              <Btn href="/betting-odds" variant="ghost">
                Betting odds explained
              </Btn>
            </div>
          </div>
        )}
      </Section>

      <Section tight>
        <Notice title="Play responsibly">
          <p>
            Nothing on this blog is betting advice, a prediction, or a guarantee of any outcome.
            Betting and casino games involve financial risk. Only take part where it is legally
            permitted in your location, set your own limits, and never stake money you cannot
            afford to lose.
          </p>
        </Notice>
      </Section>
    </main>
  );
}
