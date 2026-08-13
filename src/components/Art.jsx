/* ============================================================================
   ART — decorative line compositions. Each one inherits currentColor so the
   same shape can lean orange or green depending on where it sits, and each is
   built from strokes so DrawSVGPlugin can draw it in on scroll.
   ========================================================================== */

const svg = {
  viewBox: "0 0 300 300",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

/* Cricket: ball with seam, inside a crease arc. */
export function ArtCricket(props) {
  return (
    <svg {...svg} {...props}>
      <circle className="art-stroke" cx="150" cy="150" r="120" />
      <circle className="art-dash" cx="150" cy="150" r="97" />
      <circle className="art-stroke art-stroke--thick" cx="150" cy="150" r="62" />
      <path className="art-stroke" d="M100 120c34 18 66 18 100 0M100 180c34-18 66-18 100 0" />
      <path className="art-stroke" d="M18 246h264" />
      <path className="art-stroke" d="M150 30v42M150 228v42" />
    </svg>
  );
}

/* Football: penalty box, centre circle, spot. */
export function ArtFootball(props) {
  return (
    <svg {...svg} {...props}>
      <path className="art-stroke" d="M40 292V150a110 110 0 0 1 220 0v142" />
      <path className="art-stroke" d="M96 292v-64h108v64" />
      <path className="art-stroke" d="M132 292v-30h36v30" />
      <circle className="art-stroke" cx="150" cy="150" r="46" />
      <circle className="art-fill" cx="150" cy="150" r="4" />
      <path className="art-dash" d="M40 196h220" />
    </svg>
  );
}

/* Casino: roulette wheel spokes and a dotted rim. */
export function ArtCasino(props) {
  return (
    <svg {...svg} {...props}>
      <circle className="art-stroke" cx="150" cy="150" r="128" />
      <circle className="art-dash" cx="150" cy="150" r="108" />
      <circle className="art-stroke art-stroke--thick" cx="150" cy="150" r="46" />
      <path
        className="art-stroke"
        d="M150 22v256M22 150h256M60 60l180 180M240 60 60 240"
      />
      <circle className="art-fill" cx="150" cy="150" r="7" />
    </svg>
  );
}

/* About: the brand mark abstracted — a ring crossed by two rules. */
export function ArtMark(props) {
  return (
    <svg {...svg} {...props}>
      <circle className="art-stroke" cx="150" cy="150" r="126" />
      <circle className="art-stroke art-stroke--thick" cx="150" cy="150" r="84" />
      <path className="art-stroke" d="M14 116h272M14 184h272" />
      <circle className="art-dash" cx="150" cy="150" r="56" />
    </svg>
  );
}

/* Home split panels: a set of stumps, and a pitch fragment. */
export function ArtStumps(props) {
  return (
    <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path className="art-stroke art-stroke--thick" d="M60 60v190M100 52v198M140 60v190" />
      <path className="art-stroke" d="M46 46h44M110 46h44" />
      <path className="art-stroke" d="M10 250h180" />
      <circle className="art-dash" cx="100" cy="150" r="86" />
    </svg>
  );
}

export function ArtPitch(props) {
  return (
    <svg viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path className="art-stroke" d="M10 276V126a100 100 0 0 1 200 0v150" />
      <path className="art-stroke" d="M62 276v-70h96v70" />
      <circle className="art-stroke" cx="110" cy="140" r="42" />
      <path className="art-dash" d="M10 200h200M10 240h200" />
    </svg>
  );
}

/* Tennis: ball with curved seams and court lines. */
export function ArtTennis(props) {
  return (
    <svg {...svg} {...props}>
      <circle className="art-stroke" cx="150" cy="150" r="120" />
      <path className="art-stroke art-stroke--thick" d="M70 70c40 40 40 120 0 160M230 70c-40 40-40 120 0 160" />
      <path className="art-stroke" d="M30 150h240" />
      <path className="art-dash" d="M150 30v240" />
      <circle className="art-fill" cx="150" cy="150" r="5" />
    </svg>
  );
}

/* Basketball: ball with rib lines and hoop rim. */
export function ArtBasketball(props) {
  return (
    <svg {...svg} {...props}>
      <circle className="art-stroke" cx="150" cy="150" r="120" />
      <path className="art-stroke art-stroke--thick" d="M30 150h240M150 30v240" />
      <path className="art-stroke" d="M70 70c40 40 40 120 0 160M230 70c-40 40-40 120 0 160" />
      <circle className="art-dash" cx="150" cy="150" r="85" />
    </svg>
  );
}

/* Odds: percent / scale geometric symbol. */
export function ArtOdds(props) {
  return (
    <svg {...svg} {...props}>
      <circle className="art-stroke" cx="150" cy="150" r="120" />
      <path className="art-stroke art-stroke--thick" d="M70 230L230 70" />
      <circle className="art-stroke" cx="100" cy="100" r="30" />
      <circle className="art-stroke" cx="200" cy="200" r="30" />
      <circle className="art-dash" cx="150" cy="150" r="85" />
    </svg>
  );
}

