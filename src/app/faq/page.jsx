import Accordion from "@/components/Accordion";
import { ArtMark } from "@/components/Art";
import { Clock, Shield } from "@/components/Icons";
import {
  Block,
  Btn,
  CTABand,
  Notice,
  PageHero,
  Section,
  Stat,
  Ticker,
} from "@/components/ui";

export const metadata = {
  title: "Betting FAQ | Sports Betting, Odds, Payments & Account Help",
  description:
    "Find answers to common betting questions about sports, odds, live betting, accounts, payments, withdrawals, bonuses, verification and responsible gambling.",
};

const tickerItems = [
  "Account Help",
  "Sports Betting FAQ",
  "Betting Odds Explained",
  "Deposits & Withdrawals",
  "Identity Verification",
  "Security & Privacy",
  "Promotions & Bonuses",
  "Responsible Gambling",
];

const faqsGroup1 = [
  {
    q: "What is this betting website?",
    a: "This is an online betting platform where eligible users can access available sports, betting markets, odds, and other betting options. Available services depend on your location and applicable regulations.",
  },
  {
    q: "How do I create an account?",
    a: "Select the registration option and provide the required information. You may need to complete identity and age verification before accessing certain services or placing bets.",
  },
  {
    q: "What sports can I bet on?",
    a: "Available sports can vary, but may include football, basketball, tennis, cricket, baseball, hockey, horse racing, esports, and other competitions.",
  },
  {
    q: "What betting markets are available?",
    a: "Depending on the sport and event, available markets may include moneyline, match winner, handicap, point spread, totals, over/under, player props, futures, accumulators, and other market types.",
  },
  {
    q: "What are betting odds?",
    a: "Betting odds represent the potential return associated with a selected outcome. Odds can be displayed in formats such as decimal, fractional, or American and may change based on market conditions.",
  },
  {
    q: "Can I place live bets?",
    a: "Where legally available, live betting allows eligible users to place wagers while a sporting event is in progress. Live odds and available markets can change quickly during an event.",
  },
];

const faqsGroup2 = [
  {
    q: "How do I place a bet?",
    a: "Choose a sport or event, review the available markets and odds, select your preferred option, enter your stake, review the bet details, and confirm your wager if you are eligible to participate.",
  },
  {
    q: "Can I cancel or change a bet after placing it?",
    a: "Bet cancellation or changes depend on the specific market, event, and applicable betting rules. Once a wager has been accepted, it may not always be possible to cancel or modify it.",
  },
  {
    q: "What payment methods are available?",
    a: "Available payment methods depend on your location and the services supported by the platform. Payment options, minimum amounts, processing times, and applicable fees may vary.",
  },
  {
    q: "How do I make a deposit?",
    a: "Log in to your account, select the deposit option, choose an available payment method, enter the amount, and follow the instructions provided on the platform.",
  },
  {
    q: "How do I withdraw my funds?",
    a: "Select the withdrawal option in your account and choose an available withdrawal method. You may need to complete identity verification before a withdrawal can be processed.",
  },
  {
    q: "How long do withdrawals take?",
    a: "Withdrawal processing times depend on the payment method, account verification status, transaction checks, and other applicable conditions. Processing times can vary between methods.",
  },
];

const faqsGroup3 = [
  {
    q: "Why do I need to verify my identity?",
    a: "Identity verification helps confirm your identity and age and supports security, fraud prevention, and compliance with applicable legal and regulatory requirements.",
  },
  {
    q: "What documents may be required for verification?",
    a: "Depending on your location and account circumstances, you may be asked to provide documents that verify your identity, age, address, or payment information.",
  },
  {
    q: "What happens if I forget my password?",
    a: "Use the password recovery option on the login page and follow the instructions to reset your password. If you cannot access your account, contact customer support.",
  },
  {
    q: "How can I protect my account?",
    a: "Use a strong and unique password, keep your login details private, and avoid accessing your account through untrusted devices or networks. Contact support if you notice unusual activity.",
  },
  {
    q: "Are my personal and payment details secure?",
    a: "Reasonable security measures are used to protect account and transaction information. Users should also protect their login credentials and report any suspicious account activity.",
  },
  {
    q: "Are there bonuses or promotions?",
    a: "Promotions may be available from time to time. Eligibility, availability, wagering requirements, expiry dates, and other conditions vary by promotion and location. Always read the applicable promotional terms before participating.",
  },
];

const faqsGroup4 = [
  {
    q: "What happens if my bet is void?",
    a: "A void bet is generally settled according to the rules of the specific market. The outcome can depend on factors such as event cancellation, postponement, participant changes, or other circumstances defined in the applicable betting rules.",
  },
  {
    q: "What happens if a sporting event is postponed?",
    a: "The treatment of a postponed event depends on the specific sport, market, and applicable betting rules. Check the relevant market terms for details.",
  },
  {
    q: "What is responsible gambling?",
    a: "Responsible gambling means treating betting as entertainment, setting personal limits, understanding the risks, and avoiding wagers that you cannot afford to lose.",
  },
  {
    q: "Can I set betting limits?",
    a: "Where available, responsible gambling tools may allow you to set limits on deposits, wagers, losses, or account activity. Available options depend on your location and the platform.",
  },
  {
    q: "Can I self-exclude myself from betting?",
    a: "Self-exclusion options may be available to help users take a break from betting or restrict access to their account. The available process and duration depend on the platform and applicable regulations.",
  },
  {
    q: "What should I do if I have a problem with gambling?",
    a: "If betting is becoming difficult to control or is affecting your finances or everyday life, stop betting and use the responsible gambling or self-exclusion tools available to you. You can also seek appropriate support in your location.",
  },
];

const faqsGroup5 = [
  {
    q: "Is betting available everywhere?",
    a: "No. Betting availability depends on your location, applicable laws, licensing requirements, and platform restrictions. Users are responsible for ensuring that betting is legally available to them.",
  },
  {
    q: "What is the minimum age for betting?",
    a: "The minimum legal age varies by jurisdiction. You must meet the applicable legal age requirement in your location to use betting services.",
  },
  {
    q: "How can I contact customer support?",
    a: "Use the available customer support channels provided on the website. Support options and operating hours may vary.",
  },
  {
    q: "Where can I find the betting rules?",
    a: "The applicable betting rules should be available through the website's rules or terms section. Review the relevant rules before placing a wager, particularly for specialist or live markets.",
  },
  {
    q: "Where can I find the Terms and Conditions?",
    a: "The website's Terms and Conditions contain important information about account use, betting, payments, promotions, withdrawals, and other services. Users should review them before using the platform.",
  },
  {
    q: "Where can I find the Privacy Policy?",
    a: "The Privacy Policy explains how personal information is collected, used, stored, and protected. It is available through the website's legal or privacy section.",
  },
];

export default function FAQPage() {
  return (
    <main id="main">
      <PageHero
        route={<span>Frequently Asked Questions</span>}
        kicker="Help & Support"
        title="Frequently Asked Questions"
        sub="Find answers to common questions about sports, odds, live betting, accounts, payments, withdrawals, bonuses, verification and responsible gambling."
        art={<ArtMark />}
        actions={
          <>
            <Btn href="/#register" variant="primary" magnetic>
              Create an account
            </Btn>
            <Btn href="/betting-odds" variant="ghost">
              Betting odds
            </Btn>
          </>
        }
      >
        <div className="prose">
          <p>
            Find answers to common betting questions about sports, odds, live betting, accounts,
            payments, withdrawals, bonuses, verification and responsible gambling.
          </p>
        </div>
      </PageHero>

      <Ticker items={tickerItems} speed={44} dir="right" />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={30} label="Total FAQ answers" />
          <Stat value={5} label="Help categories" />
          <Stat text="24/7" label="Support available" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <Block index="01" eyebrow="Overview" title="General & Account Questions">
          <Accordion items={faqsGroup1} idPrefix="faq-g1" />
        </Block>

        <Block index="02" eyebrow="Wagers" title="Placing Bets & Payments">
          <Accordion items={faqsGroup2} idPrefix="faq-g2" />
        </Block>

        <Block index="03" eyebrow="Security" title="Verification & Account Safety">
          <Accordion items={faqsGroup3} idPrefix="faq-g3" />
        </Block>
      </Section>

      <Section band="raise">
        <Block index="04" eyebrow="Rules & Safety" title="Settlements & Responsible Gambling">
          <Accordion items={faqsGroup4} idPrefix="faq-g4" />
        </Block>

        <Block index="05" eyebrow="Legal" title="Legality, Terms & Policies">
          <Accordion items={faqsGroup5} idPrefix="faq-g5" />
        </Block>
      </Section>

      <CTABand
        index="06"
        eyebrow="Need assistance?"
        title="Still Have Questions?"
        body="Review our comprehensive betting rules, Terms and Conditions, and Privacy Policy, or reach out through our customer support channels for assistance with your account."
        actions={
          <>
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              Create an account
            </Btn>
            <Btn href="/about" variant="ghost" size="lg">
              About FairPlay
            </Btn>
          </>
        }
      />

      <Section tight>
        <Notice title="Bet responsibly">
          <p>
            18+ / Legal age applies. Betting availability depends on your location and local laws.
            Betting should be treated as entertainment and not as a guaranteed source of income. Set
            personal limits, understand the risks, and never wager more than you can afford to lose.
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
