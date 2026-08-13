/* ============================================================================
   TEEN PATTI — a fanned hand of three cards
   ----------------------------------------------------------------------------
   The casino counterweight to the cricket ball on the other side of the hero.
   Three aces, because a trail of aces is the best hand in Teen Patti — a
   detail that costs nothing and reads to anyone who plays.

   Suits are drawn as paths rather than set as glyph characters: ♠♥♦ render at
   wildly different sizes and baselines across fonts, and at this scale that
   inconsistency is obvious. Only the ranks are text.

   Lit to match the hero — the key is above and to the left of this side of the
   frame, so faces catch light at the top and each card drops a shadow onto the
   one behind it.
   ========================================================================== */

const SUITS = {
  spade:
    "M0-11c0 6-9 9-9 14.2 0 3.4 2.8 4.8 5 4.8 1.6 0 2.9-.8 3.6-2L-1.6 11h3.2L.4 6c.7 1.2 2 2 3.6 2 2.2 0 5-1.4 5-4.8C9-5 0-5 0-11Z",
  heart:
    "M0 10c-9-8-9-16-3.5-16C-1.2-6 0-4.2 0-3c0-1.2 1.2-3 3.5-3C9-6 9 2 0 10Z",
  diamond: "M0-11 8 0 0 11-8 0Z",
};

/* x / y offset, tilt, and which ace. Left card sits lowest and furthest back. */
const HAND = [
  { x: -52, y: 14, rot: -19, suit: "spade", rank: "A", red: false },
  { x: 0, y: -2, rot: -2, suit: "heart", rank: "A", red: true },
  { x: 52, y: 12, rot: 16, suit: "diamond", rank: "A", red: true },
];

export default function TeenPattiCards({ id = "patti", ...props }) {
  const u = (name) => `${id}-${name}`;

  return (
    <svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <defs>
        {/* Card stock: warm white, brightest at the top where the key light is. */}
        <linearGradient id={u("face")} x1="12%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="52%" stopColor="#f0ebe0" />
          <stop offset="100%" stopColor="#cec8ba" />
        </linearGradient>
        {/* A soft sheen raked across the faces, so they read as coated stock. */}
        <linearGradient id={u("sheen")} x1="0%" y1="0%" x2="100%" y2="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {HAND.map((card) => (
        <g
          key={card.suit}
          transform={`translate(${card.x} ${card.y}) rotate(${card.rot} 130 150)`}
        >
          {/* Cast shadow onto the card behind. Offset down-right, away from the key. */}
          <rect x="95" y="101" width="76" height="106" rx="8" fill="#000" opacity="0.45" />
          <rect
            x="92"
            y="97"
            width="76"
            height="106"
            rx="8"
            fill={`url(#${u("face")})`}
            stroke="rgba(20,10,6,0.35)"
            strokeWidth="1"
          />
          <rect x="92" y="97" width="76" height="106" rx="8" fill={`url(#${u("sheen")})`} />

          <text
            className="patti__rank"
            x="101"
            y="118"
            fill={card.red ? "#c0242c" : "#191418"}
          >
            {card.rank}
          </text>
          <path
            d={SUITS[card.suit]}
            transform="translate(105 127) scale(0.44)"
            fill={card.red ? "#c0242c" : "#191418"}
          />
          <path
            d={SUITS[card.suit]}
            transform="translate(130 155) scale(1.15)"
            fill={card.red ? "#c0242c" : "#191418"}
          />
        </g>
      ))}
    </svg>
  );
}
