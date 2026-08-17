import { JsonLd, breadcrumbSchema, faqSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";
import Accordion from "@/components/Accordion";
import Casino3D from "@/components/Casino3D";
import { Live, Shield, Sparkle } from "@/components/Icons";
import {
  Block,
  Btn,
  Bullets,
  CTABand,
  Callout,
  Feature,
  Head,
  Notice,
  PageHero,
  QuoteBand,
  Section,
  Stat,
  Ticker,
  TileGrid,
} from "@/components/ui";

export const metadata = pageMeta({
  title: "Online Casino Games",
  description:
    "Explore casino games online — slots, roulette, blackjack, baccarat and live dealer tables, with the rules and limits of each game explained.",
  path: "/casino",
});

const findItems = [
  "Online slots",
  "Roulette",
  "Blackjack",
  "Baccarat",
  "Live casino games",
  "Live dealer games",
  "Different game variations",
  "Game rules and information",
  "Responsible gambling tools",
];

const tables = [
  {
    tag: "Slots",
    title: "Online Slots",
    intro: "Online slots are available in a wide range of themes and gameplay styles.",
    lead: "Depending on the game, you may find:",
    items: [
      "Different paylines",
      "Bonus features",
      "Special symbols",
      "Multiple game themes",
      "Different betting options",
    ],
    outro: "Check the individual game information for its rules, features, and payout details.",
  },
  {
    tag: "Wheel",
    title: "Roulette Online",
    intro: "Roulette online is a classic casino game based on a numbered wheel.",
    lead: "Depending on the available version, you may find:",
    items: [
      "European roulette",
      "American roulette",
      "Different betting options",
      "Inside and outside bets",
      "Live roulette",
    ],
    outro: "Review the rules and available betting options before playing.",
  },
  {
    tag: "Cards",
    title: "Online Blackjack",
    intro:
      "Online blackjack is a card game where players play against the dealer according to the game's rules.",
    lead: "Key aspects include:",
    items: [
      "Card values",
      "Dealer rules",
      "Hit and stand options",
      "Different blackjack variations",
      "Table betting limits",
    ],
    outro: "The rules and available features can vary between blackjack games.",
  },
  {
    tag: "Cards",
    title: "Online Baccarat",
    intro: "Online baccarat is a traditional casino card game with simple gameplay.",
    lead: "Players can review:",
    items: [
      "Baccarat rules",
      "Available betting options",
      "Different baccarat variations",
      "Table limits",
      "Game information",
    ],
    outro: "Always check the specific rules of the baccarat table before playing.",
  },
];

const liveCasinoCards = [
  {
    tag: "Live Wheel",
    title: "Live Roulette",
    desc: "Real-time European & American roulette wheels with live croupiers and instant spin results.",
  },
  {
    tag: "Live Cards",
    title: "Live Blackjack",
    desc: "Interactive card action against real dealers with live chat, side bets, and multi-seat options.",
  },
  {
    tag: "Live Cards",
    title: "Live Baccarat",
    desc: "Fast-paced traditional player vs banker card tables streamed in high definition.",
  },
  {
    tag: "Specialty",
    title: "Other Live Dealer Games",
    desc: "Game shows, live dice, and specialty dealer tables updating continuously in real time.",
  },
];

const steps = [
  {
    title: "Create an account",
    body: "Register using the required information and complete any applicable age and identity verification.",
  },
  {
    title: "Browse the games",
    body: "Choose from the available casino games online and explore different categories.",
  },
  {
    title: "Understand the game",
    body: "Check the game rules, betting limits, available features, game information and applicable terms.",
  },
  {
    title: "Set your limits",
    body: "Use available account controls and responsible gambling tools to manage your activity.",
  },
  {
    title: "Play responsibly",
    body: "Only participate where legally permitted and only use money you can afford to lose.",
  },
];

const promotions = [
  "Eligibility requirements",
  "Minimum requirements",
  "Wagering conditions",
  "Promotion period",
  "Expiry date",
  "Game restrictions",
  "Withdrawal conditions",
  "Full promotion terms",
];

const security = [
  "Licensing and regulatory status",
  "Account verification",
  "Privacy practices",
  "Payment security",
  "Game rules",
  "Terms and conditions",
  "Customer support",
  "Responsible gambling",
];

const responsible = [
  "Set a budget before playing.",
  "Never chase losses.",
  "Take regular breaks.",
  "Use available spending or deposit limits.",
  "Don't gamble with money needed for essential expenses.",
  "Consider self-exclusion if you need a break.",
  "Seek appropriate support if gambling becomes difficult to control.",
  "Only gamble if you are legally permitted to do so in your location.",
];

const transparent = [
  "Clear game information",
  "Transparent terms",
  "Security information",
  "Licensing details",
  "Payment information",
  "Customer support",
  "Responsible gambling resources",
];

const faqs = [
  {
    q: "What are online casino games?",
    a: "Online casino games are digital versions of traditional casino games that can be played through an online platform. Common categories include slots, roulette, blackjack, baccarat, and live casino games.",
  },
  {
    q: "What casino games can I find online?",
    a: "Depending on the platform, available casino games online may include:",
    extra: (
      <>
        <Bullets
          items={[
            "Slots",
            "Roulette",
            "Blackjack",
            "Baccarat",
            "Live dealer games",
            "Other casino game variations",
          ]}
          cols={3}
        />
        <p>Game availability can vary by location.</p>
      </>
    ),
  },
  {
    q: "What is a live casino?",
    a: "A live casino uses real-time video streaming and live dealers to create an interactive casino experience online. Common live games include roulette, blackjack, and baccarat.",
  },
  {
    q: "Are casino winnings guaranteed?",
    a: "No. Casino games involve risk, and there is no guaranteed return or guaranteed profit. Players can lose money.",
  },
  {
    q: "How can I understand a casino game's rules?",
    a: "Each game should provide its own rules and information. Review the game's betting options, features, limits, and terms before playing.",
  },
  {
    q: "Is online casino gambling legal?",
    a: "Online gambling laws vary between countries, states, and jurisdictions. Check the laws that apply to your location before participating.",
  },
  {
    q: "Can I set gambling limits?",
    a: "Where available, responsible gambling tools may allow users to set limits on deposits, spending, playing time, or account activity.",
  },
];

/* Home → this page. The trail matches the visible route line in PageHero. */
const crumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Casino", path: "/casino" },
]);

export default function CasinoPage() {
  return (
    <main id="main" className="casino-page">
      <JsonLd
        schema={graph(
          crumbs,
          webPageSchema({
            title: metadata.title,
            description: metadata.description,
            path: "/casino",
            breadcrumb: crumbs,
          }),
          faqSchema(faqs, "/casino"),
        )}
      />

      <PageHero
        route={<span>Casino</span>}
        kicker="Explore casino games online"
        title="Online Casino Games"
        sub="Slots, roulette, blackjack, baccarat and live dealer tables — in one place."
        art={<Casino3D />}
        actions={
          <>
            <Btn href="/#register" variant="primary" magnetic>
              Create an account
            </Btn>
            <Btn href="/#download" variant="ghost">
              Get the app
            </Btn>
          </>
        }
      >
        <div className="prose">
          <p>
            Looking for online casino games in one place? Browse a range of popular casino games,
            including slots, roulette, blackjack, baccarat, and live casino games.
          </p>
          <p>
            Each game has its own rules, features, and betting options. Take a moment to understand
            how a game works before you play.
          </p>
        </div>
      </PageHero>

      <Ticker items={findItems} speed={40} />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={4} label="Table game families" />
          <Stat value={9} label="Things you can find" />
          <Stat value={5} label="Steps to get playing" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <Block index="01" eyebrow="Overview" title="What You Can Find">
          <TileGrid items={findItems} compact />
        </Block>
      </Section>

      <Section band="raise">
        <Block index="02" eyebrow="Casino games" title="Casino Games">
          <div className="grid cols-2" style={{ "--gap": "var(--sp-5)" }}>
            {tables.map((table) => (
              <article className="card stack" key={table.title} data-tilt="4">
                <span className="eyebrow eyebrow--bare index">{table.tag}</span>
                <h3 className="t-h3">{table.title}</h3>
                <p className="t-small">{table.intro}</p>
                <p className="t-small t-o">{table.lead}</p>
                <Bullets items={table.items} cols={2} />
                <p className="t-small">{table.outro}</p>
              </article>
            ))}
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="03" eyebrow="Live casino" title="Live Dealer Casino Games">
          <div className="prose">
            <p>A live casino combines online gameplay with a live dealer experience.</p>
            <p>Depending on availability, live casino games may include:</p>
          </div>
          <div className="grid cols-2" style={{ marginBlock: "var(--sp-6)", gap: "var(--sp-4)" }} data-anim="stagger">
            {liveCasinoCards.map((card) => (
              <article className="card tile" key={card.title} data-tilt="4">
                <span className="tile__edge" aria-hidden="true" />
                <span className="eyebrow eyebrow--g" style={{ marginBottom: "var(--sp-2)" }}>
                  {card.tag}
                </span>
                <h3 className="tile__name">{card.title}</h3>
                <p className="t-small" style={{ marginTop: "var(--sp-2)", color: "var(--fg-2)" }}>
                  {card.desc}
                </p>
              </article>
            ))}
          </div>
          <Callout>
            Live games are streamed in real time, allowing players to follow the game as it takes
            place. Availability may vary depending on location and applicable regulations.
          </Callout>
        </Block>
      </Section>

      <QuoteBand wide>
        Casino games should be judged on <em>clarity</em> — clear rules, clear limits, clear terms —
        before anything else.
      </QuoteBand>

      {/* A five-step strip needs the full shell width, so this section uses the
          head layout rather than a narrow block. */}
      <Section>
        <Head
          index="04"
          eyebrow="How it works"
          title="How Online Casino Games Work"
          aside="Getting started is straightforward — five steps, in the same order every time."
        />
        <div className="grid cols-5" data-anim="stagger">
          {steps.map((step, i) => (
            <article className="card tile tile--tall" key={step.title}>
              <span className="tile__edge" aria-hidden="true" />
              <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="tile__name" style={{ maxWidth: "16ch" }}>
                  {step.title}
                </h3>
                <p className="t-small" style={{ marginTop: "var(--sp-3)" }}>
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section band="raise">
        <Block index="05" eyebrow="Promotions" title="Casino Promotions">
          <div className="prose">
            <p>Promotional offers may be available to eligible users.</p>
            <p>Before participating in any casino promotion, check:</p>
          </div>
          <Bullets items={promotions} cols={3} />
          <div className="prose">
            <p>Promotion availability can vary by jurisdiction and user eligibility.</p>
          </div>
        </Block>

        <Block index="06" eyebrow="Security" title="Safe & Secure Casino Experience">
          <div className="prose">
            <p>Security and transparency are important when choosing an online casino.</p>
            <p>A trustworthy platform should clearly provide information about:</p>
          </div>
          <Bullets items={security} cols={3} />
          <div className="prose">
            <p>
              Users should review the relevant information before creating an account or
              participating.
            </p>
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="07" eyebrow="Responsible gambling" title="Keep Gambling Responsible">
          <div className="prose prose--lede">
            <p>
              Casino games involve financial risk. They should be viewed as entertainment and not as
              a way to make guaranteed income.
            </p>
          </div>
          <Bullets items={responsible} cols={2} />
        </Block>
      </Section>

      <Section band="raise">
        <div className="split">
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">08</span> Answers
            </span>
            <h2 className="t-h2" data-anim="split">
              Casino FAQs
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              The basics of how online casino games work, and what to check before you play.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="casino-faq" />
          </div>
        </div>
      </Section>

      <Section>
        <Block index="09" eyebrow="Transparency" title="Why Choose a Transparent Casino Platform?">
          <div className="prose">
            <p>
              A good casino experience should be based on clarity, security, and responsible play.
            </p>
            <p>Users should be able to easily find:</p>
          </div>
          <Bullets items={transparent} cols={3} />
          <div className="grid cols-3" data-anim="stagger" style={{ marginTop: "var(--sp-4)" }}>
            <Feature
              icon={<Sparkle />}
              title="Clear game information"
              body="Rules, features and limits stated up front for every game."
            />
            <Feature
              icon={<Shield />}
              title="Transparent terms"
              body="Conditions and eligibility written where you can actually find them."
            />
            <Feature
              icon={<Live />}
              title="Support when needed"
              body="Customer support and responsible gambling resources kept in reach."
              lean="g"
            />
          </div>
          <div className="prose">
            <p>
              The goal is to make important information easy to understand before users make
              decisions.
            </p>
          </div>
        </Block>
      </Section>

      <CTABand
        index="10"
        eyebrow="Play responsibly"
        title="Play Responsibly"
        body="Online casino games are entertainment and involve financial risk. Only participate where permitted by law, understand the rules before playing, set appropriate limits, and never treat gambling as a guaranteed source of income."
        actions={
          <Btn href="/#register" variant="primary" size="lg" magnetic>
            Create an account
          </Btn>
        }
      />

      <Section tight>
        <Notice title="18+ / Legal age applies">
          <p>
            Gambling availability depends on your location and applicable laws. Casino games involve
            financial risk and there is no guaranteed return — treat them as entertainment, not as a
            source of income.
          </p>
        </Notice>
      </Section>
    </main>
  );
}
