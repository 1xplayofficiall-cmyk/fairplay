import Accordion from "@/components/Accordion";
import { ArtOdds } from "@/components/Art";
import { Bolt, Clock, Live, Shield } from "@/components/Icons";
import {
  Block,
  Btn,
  Bullets,
  CTABand,
  Callout,
  Feature,
  Notice,
  PageHero,
  QuoteBand,
  Section,
  Stat,
  Steps,
  Ticker,
  TileGrid,
} from "@/components/ui";

export const metadata = {
  title: "Betting Odds Explained | Sports, Live & Online Betting Odds",
  description:
    "Learn how betting odds work and how to read decimal, fractional and American odds. Explore sports betting odds, live odds, betting lines and more.",
};

const sportsMarkets = [
  "Football betting odds",
  "Basketball betting odds",
  "Tennis betting odds",
  "Cricket betting odds",
  "Baseball betting odds",
  "Hockey betting odds",
  "Horse racing odds",
  "Esports betting odds",
];

const bettingLineTypes = [
  "Moneyline",
  "Point spread",
  "Handicap",
  "Over/under",
  "Totals",
  "Player props",
  "Team props",
  "Futures",
];

const oddsFormats = [
  [
    "Decimal Betting Odds",
    "Decimal odds are widely used by sportsbooks around the world. They show the total return for every unit staked, including the original stake. For example, odds of 2.50 mean that a $10 stake would return $25 if the selection wins. Decimal odds are popular because they are straightforward to understand and compare.",
  ],
  [
    "Fractional Betting Odds",
    "Fractional odds are traditionally associated with the UK and Ireland. They show the potential profit relative to the amount staked. For example, odds of 3/1 mean that a $10 stake could generate a $30 profit, plus the original $10 stake.",
  ],
  [
    "American Betting Odds",
    "American betting odds use positive and negative numbers. Positive odds generally indicate the potential profit from a $100 stake, while negative odds indicate how much would need to be staked to generate a $100 profit. The format is commonly used for US sports betting markets.",
  ],
];

const popularSportsOdds = [
  [
    "Football Betting Odds",
    "Football betting odds can include match winner, draw, handicap, totals, both teams to score, correct score, and player markets.",
  ],
  [
    "Basketball Betting Odds",
    "Basketball betting odds commonly include moneyline, point spread, over/under, player props, and futures.",
  ],
  [
    "Tennis Betting Odds",
    "Tennis odds can cover match winners, set betting, game handicaps, totals, and selected player markets.",
  ],
  [
    "Cricket Betting Odds",
    "Cricket betting markets can include match winners, innings totals, player performance markets, and other competition-specific options.",
  ],
];

const oddsChangeFactors = [
  "Player injuries",
  "Team news",
  "Starting lineups",
  "Recent performances",
  "Changes in market activity",
  "Public betting patterns",
  "Weather conditions",
  "Home or away status",
  "Game-time developments",
];

const howToReadSteps = [
  "Identify the event and market.",
  "Check the available selections.",
  "Identify the odds format.",
  "Compare the prices available.",
  "Review the market rules.",
  "Check the potential return based on your stake.",
  "Confirm that betting is legally available to you.",
];

const faqs = [
  {
    q: "What are betting odds?",
    a: "Betting odds show the potential return associated with a particular betting selection. They can be displayed in decimal, fractional, or American formats.",
  },
  {
    q: "How do I read betting odds?",
    a: "First identify the odds format. Decimal odds show the total return per unit staked, while fractional and American formats use different methods to represent potential profit and returns.",
  },
  {
    q: "What are decimal betting odds?",
    a: "Decimal odds show the total return, including the original stake, for a winning bet.",
  },
  {
    q: "What are fractional betting odds?",
    a: "Fractional odds show the potential profit relative to the stake. They are commonly used in the UK and Ireland.",
  },
  {
    q: "What are American betting odds?",
    a: "American odds use positive and negative numbers to show potential profit or the stake required to generate a specified profit.",
  },
  {
    q: "Why do betting odds change?",
    a: "Odds can change because of new information, market activity, player availability, injuries, team news, or events taking place during a live match.",
  },
  {
    q: "What are live betting odds?",
    a: "Live betting odds are prices offered while a sporting event is taking place. They can change rapidly as the event develops.",
  },
  {
    q: "Are higher betting odds better?",
    a: "Higher odds offer a greater potential return for the same stake, but they generally represent a lower implied probability. A higher price does not guarantee a better outcome.",
  },
  {
    q: "Can betting odds guarantee a result?",
    a: "No. Odds represent market pricing and potential returns, not certainty. Every sports bet involves risk.",
  },
];

export default function BettingOddsPage() {
  return (
    <main id="main">
      <PageHero
        route={<span>Betting odds</span>}
        kicker="Betting odds explained"
        title="Betting Odds"
        sub="Betting odds show the potential return associated with a particular betting selection."
        lean="g"
        art={<ArtOdds />}
        actions={
          <>
            <Btn href="/#register" variant="primary" magnetic>
              Create an account
            </Btn>
            <Btn href="/cricket-betting" variant="ghost">
              Cricket betting
            </Btn>
          </>
        }
      >
        <div className="prose">
          <p>
            Betting odds show the potential return associated with a particular betting selection. They
            are used across sports and markets, including football, basketball, tennis, cricket, and live
            betting.
          </p>
          <p>
            Understanding betting odds can help you compare different markets, understand potential
            returns, and make more informed decisions before placing a wager.
          </p>
          <p className="index">
            Odds can vary between sportsbooks, sports, competitions, and individual markets. They can
            also change before an event begins and during live betting.
          </p>
        </div>
      </PageHero>

      <Ticker items={sportsMarkets} speed={44} dir="right" />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={3} label="Common formats" />
          <Stat value={8} label="Sports covered" />
          <Stat value={7} label="Steps to read odds" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <Block index="01" eyebrow="How it works" title="How Betting Odds Work">
          <div className="prose">
            <p>
              Betting odds represent the price of a particular outcome. They indicate how much a winning
              wager could return based on the amount staked and the displayed odds.
            </p>
            <p>
              For example, if a selection is offered at decimal odds of 2.00, a $10 stake would return
              $20 if the bet wins, including the original stake.
            </p>
          </div>
          <Callout>
            The actual return depends on the odds, stake, market rules, and applicable terms.
          </Callout>
        </Block>

        <Block index="02" eyebrow="Formats" title="Types of Betting Odds">
          <div className="prose">
            <p>There are several common formats used to display sports betting odds.</p>
          </div>
          <div className="grid cols-3" data-anim="stagger">
            {oddsFormats.map(([title, body], i) => (
              <article className="card tile tile--compact" key={title}>
                <span className="tile__edge" aria-hidden="true" />
                <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="tile__name" style={{ maxWidth: "22ch" }}>
                    {title}
                  </h3>
                  <p className="t-small" style={{ marginTop: "var(--sp-3)" }}>
                    {body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Block>
      </Section>

      <QuoteBand wide>
        Implied probability = 1 ÷ decimal odds × 100 — decimal odds of 2.00 correspond to an implied
        probability of 50%.
      </QuoteBand>

      <Section>
        <Block index="03" eyebrow="Sports" title="Sports Betting Odds">
          <div className="prose">
            <p>Sports betting odds are available across a wide range of competitions and markets.</p>
            <p className="t-g">Depending on the sport and sportsbook, you may find:</p>
          </div>
          <Bullets items={sportsMarkets} cols={3} />
          <div className="prose">
            <p>Each sport can have different markets and pricing depending on the event.</p>
          </div>
        </Block>

        <Block index="04" eyebrow="Lines" title="Betting Lines">
          <div className="prose">
            <p>Betting lines are the prices and market numbers offered for a particular event.</p>
            <p className="t-g">Depending on the sport, a betting line may include:</p>
          </div>
          <Bullets items={bettingLineTypes} cols={4} />
          <div className="prose">
            <p>
              Lines can move when new information becomes available, such as injuries, team news, weather
              conditions, or changes in market activity.
            </p>
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="05" eyebrow="In-play" title="Live Betting Odds">
          <div className="prose">
            <p>
              Live betting odds are displayed while an event is in progress, where live betting is
              legally available.
            </p>
            <p>
              Unlike pre-match odds, live odds can change rapidly as the game develops. The score, time
              remaining, player performance, possession, and other events can all affect the available
              markets.
            </p>
            <p>
              For example, basketball live betting odds may change after a three-point shot, timeout,
              injury, or major change in the score.
            </p>
          </div>
          <div className="grid cols-3" data-anim="stagger">
            <Feature
              icon={<Live />}
              title="Real-time pricing"
              body="Live odds update dynamically as scoring and momentum shifts take place."
              lean="g"
            />
            <Feature
              icon={<Clock />}
              title="In-play volatility"
              body="Markets may open, pause, close, or adjust during timeouts and breaks."
            />
            <Feature
              icon={<Bolt />}
              title="Event-driven shifts"
              body="Possession, injuries, and time remaining immediately impact live pricing."
            />
          </div>
          <Callout>
            Always check the current live odds and market rules before confirming an in-play wager.
          </Callout>
        </Block>
      </Section>

      <Section>
        <Block index="06" eyebrow="Probability" title="Betting Odds Explained: Implied Probability">
          <div className="prose">
            <p>Betting odds can also be used to estimate the implied probability of an outcome.</p>
            <p className="t-g">For decimal odds, the basic calculation is:</p>
            <p className="t-lede">Implied probability = 1 ÷ decimal odds × 100</p>
            <p>For example, decimal odds of 2.00 correspond to an implied probability of 50%.</p>
            <p>
              This does not mean the outcome is guaranteed to happen. Sportsbooks generally include a
              margin in their pricing, so the combined implied probabilities across a market can exceed
              100%.
            </p>
          </div>
        </Block>

        <Block index="07" eyebrow="Comparison" title="Betting Odds vs Betting Lines">
          <div className="prose">
            <p>
              The terms &ldquo;odds&rdquo; and &ldquo;lines&rdquo; are often used together, but they can
              refer to slightly different parts of a betting market.
            </p>
            <p>Betting odds describe the price or potential return attached to a selection.</p>
            <p>
              Betting lines can refer more broadly to the numbers and prices offered within a market,
              such as a point spread, total, or handicap.
            </p>
            <p>The exact terminology can vary between sportsbooks and sports.</p>
          </div>
        </Block>

        <Block index="08" eyebrow="Movement" title="Why Do Betting Odds Change?">
          <div className="prose">
            <p>Betting odds can change for several reasons.</p>
            <p className="t-g">Common factors include:</p>
          </div>
          <Bullets items={oddsChangeFactors} cols={3} />
          <div className="prose">
            <p>
              Live betting odds can change even more frequently because they respond to events
              happening during the match.
            </p>
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="09" eyebrow="Guide" title="How to Read Betting Odds">
          <div className="prose">
            <p>If you&apos;re new to sports betting, start by identifying the odds format being displayed.</p>
            <p className="t-g">Then follow these steps:</p>
          </div>
          <Steps items={howToReadSteps} rail />
          <div className="prose">
            <p>
              Understanding the odds does not guarantee a winning bet. Sports outcomes remain
              unpredictable.
            </p>
          </div>
        </Block>

        <Block index="10" eyebrow="Value" title="Best Betting Odds">
          <div className="prose">
            <p>
              When comparing betting odds, a higher price can offer a higher potential return for the
              same stake, but it does not necessarily mean that the outcome is more likely.
            </p>
            <p>
              If multiple betting sites offer the same market, comparing available odds can help you
              understand differences in pricing.
            </p>
            <p>
              Always consider the full market terms rather than choosing an option based only on the
              displayed price.
            </p>
          </div>
        </Block>

        <Block index="11" eyebrow="Sports odds" title="Betting Odds for Popular Sports">
          <div className="grid cols-2" data-anim="stagger">
            {popularSportsOdds.map(([title, body], i) => (
              <article className="card tile tile--compact" key={title}>
                <span className="tile__edge" aria-hidden="true" />
                <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="tile__name" style={{ maxWidth: "24ch" }}>
                    {title}
                  </h3>
                  <p className="t-small" style={{ marginTop: "var(--sp-3)" }}>
                    {body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Block>
      </Section>

      <Section>
        <div className="split">
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">12</span> Answers
            </span>
            <h2 className="t-h2" data-anim="split">
              Betting Odds FAQs
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              Decimal, fractional, and American formats explained simply.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="odds-faq" />
          </div>
        </div>
      </Section>

      <Section band="raise">
        <Block index="13" eyebrow="Responsible betting" title="Responsible Betting">
          <div className="prose prose--lede">
            <p>
              Understanding betting odds can help you understand the potential return and risk
              associated with a wager, but it cannot guarantee a profit.
            </p>
          </div>
          <div className="prose">
            <p>
              Set a budget before betting, avoid chasing losses, and never wager more than you can
              afford to lose. Use responsible gambling tools and self-exclusion options where available.
            </p>
          </div>
        </Block>
      </Section>

      <CTABand
        index="14"
        eyebrow="Play responsibly"
        title="Play Responsibly"
        body="Understanding betting odds can help you understand potential returns, but sports outcomes remain unpredictable. Set personal limits, understand the risks, and never wager more than you can afford to lose."
        actions={
          <>
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              Create an account
            </Btn>
            <Btn href="/casino" variant="ghost" size="lg">
              Explore the casino
            </Btn>
          </>
        }
      />

      <Section tight>
        <Notice title="Bet responsibly">
          <p>
            18+ / Legal age applies. Betting availability depends on your location and local laws.
            Understanding betting odds helps evaluate potential returns but cannot guarantee a
            profit. Set personal limits, avoid chasing losses, and only wager what you can afford to
            lose.
          </p>
          <div className="row" style={{ marginTop: "var(--sp-2)" }}>
            <span className="tag">
              <Shield width={12} height={12} /> Set deposit limits
            </span>
            <span className="tag">
              <Clock width={12} height={12} /> Take regular breaks
            </span>
          </div>
        </Notice>
      </Section>
    </main>
  );
}
