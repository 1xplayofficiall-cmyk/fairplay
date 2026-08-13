/* ============================================================================
   ICONS — one stroke weight, one grid, one join style. A mismatched icon set
   is the fastest way to make an otherwise expensive layout look cheap.
   ========================================================================== */

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ArrowUpRight = (props) => (
  <svg {...base} {...props}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const ArrowRight = (props) => (
  <svg {...base} {...props}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const Close = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowDown = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);

export const Check = (props) => (
  <svg {...base} {...props}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </svg>
);

export const Shield = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3 5 6v6c0 4 3 7.2 7 9 4-1.8 7-5 7-9V6l-7-3Z" />
    <path d="M9 12.2l2.1 2.1L15.5 10" />
  </svg>
);

export const Bolt = (props) => (
  <svg {...base} {...props}>
    <path d="M13.5 3 5.5 13.4h5.2L10 21l8-10.6h-5.2L13.5 3Z" />
  </svg>
);

export const Wallet = (props) => (
  <svg {...base} {...props}>
    <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h11.5A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18H6a2.5 2.5 0 0 1-2.5-2.5v-7Z" />
    <path d="M16 12h1.5" />
  </svg>
);

export const Download = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5v11M7.5 10 12 14.5 16.5 10M4.5 19h15" />
  </svg>
);

export const Clock = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Live = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M6.6 6.6a7.6 7.6 0 0 0 0 10.8M17.4 17.4a7.6 7.6 0 0 0 0-10.8" />
  </svg>
);

export const Sparkle = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5 13.7 9 19 10.8 13.7 12.6 12 18l-1.7-5.4L5 10.8 10.3 9 12 3.5Z" />
  </svg>
);

export const Phone = (props) => (
  <svg {...base} {...props}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 6h2" />
  </svg>
);
