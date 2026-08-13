/* ============================================================================
   CRICKET BALL
   ----------------------------------------------------------------------------
   A rendered object, not a line drawing — so it deliberately does not follow
   the conventions in Art.jsx (stroke-only, currentColor, DrawSVG-able). It is
   built from stacked gradients instead.

   The split into a spinning group and fixed layers above it is the whole
   trick. Light does not turn with an object, so the leather inside the group
   is flat and rotation-invariant, and every directional cue — terminator,
   warm rim, specular — sits outside the group and stays where the hero's key
   light puts it. Rotating a sphere that carries its own highlight looks like
   a spinning texture; this looks like a spinning ball.

   The seam is the near half of a great circle: an elliptical arc whose ends
   land exactly on the silhouette. The stitching is the same arc offset and
   stroked with a dash pattern, far cheaper than sixty individual stitches and
   identical at this size. The group's bounding box is exactly the ball, so it
   rotates about its own centre with no origin fixing.
   ========================================================================== */

const SEAM_START = "M 18.4 133";
const SEAM_END = "181.6 67";

export default function CricketBall({ id = "ball", spin = 14, ...props }) {
  /* Gradient ids have to be unique per instance or a second ball on the page
     would silently inherit the first one's fills. */
  const u = (name) => `${id}-${name}`;

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <defs>
        {/* Leather, lit from nowhere in particular — it turns, so it cannot
            carry a highlight. Centred radial only, for a little depth. */}
        <radialGradient id={u("body")} cx="50%" cy="50%" r="74%">
          <stop offset="0%" stopColor="#d8383e" />
          <stop offset="70%" stopColor="#b62930" />
          <stop offset="100%" stopColor="#8e1a21" />
        </radialGradient>

        {/* Everything below is fixed to the frame, not the ball. */}

        {/* The lit face. Kept low and warm — a strong pale wash here is what
            turned the leather brown rather than red. */}
        <radialGradient id={u("key")} cx="66%" cy="26%" r="62%">
          <stop offset="0%" stopColor="#ff7a5a" stopOpacity="0.32" />
          <stop offset="48%" stopColor="#e0483a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {/* Terminator — deepens the lower-left away from the key light. */}
        <radialGradient id={u("shade")} cx="70%" cy="22%" r="86%">
          <stop offset="40%" stopColor="#000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.66" />
        </radialGradient>

        <radialGradient id={u("spec")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.62" />
          <stop offset="45%" stopColor="#ffd9c9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {/* Warm bounce along the shadowed edge, so the ball sits in the hero's
            light instead of on top of it. */}
        <linearGradient id={u("rim")} x1="10%" y1="88%" x2="72%" y2="18%">
          <stop offset="0%" stopColor="var(--o-400, #ffa233)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--o-500, #ff8c00)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <clipPath id={u("clip")}>
          <circle cx="100" cy="100" r="88" />
        </clipPath>
      </defs>

      {/* ------------------------------------------------- turns with the ball
          SVG's initial `transform-origin` is `0 0`, not `50% 50%` as it is for
          HTML — so without this GSAP pivots the group around the corner of its
          bounding box and swings the whole ball clean out of frame instead of
          spinning it in place.

          CSS cannot express the pivot reliably here. `center` needs
          `transform-box: fill-box`, which also moves the browser's own
          reference point to the box corner and applies it on top of the origin
          GSAP bakes into its matrix — the ball orbits rather than spins. Plain
          lengths and percentages both get resolved against the group's
          bounding box, which for a clipped group is not the ball's centre.
          `data-spin-origin` hands GSAP the pivot in SVG user units, where the
          ball is unambiguously at 100 100. */}
      <g data-spin data-spin-origin="100 100" data-spin-duration={spin}>
        <circle cx="100" cy="100" r="88" fill={`url(#${u("body")})`} />
        <g clipPath={`url(#${u("clip")})`}>
          {/* Recessed join line, then the two rows of stitches either side.
              These are sized to survive the ball's *rendered* size, not to be
              anatomically fine: at ~150px across, hairline stitches collapse to
              sub-pixel dashes and the ball reads as a plain sphere — which also
              hides the fact that it is turning at all. */}
          <path
            d={`${SEAM_START} A 88 31 -22 0 1 ${SEAM_END}`}
            fill="none"
            stroke="#5e1016"
            strokeWidth="7"
            opacity="0.9"
          />
          <path
            d={`${SEAM_START} A 88 20 -22 0 1 ${SEAM_END}`}
            fill="none"
            stroke="#fff6e4"
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeDasharray="5 6.5"
            opacity="0.95"
          />
          <path
            d={`${SEAM_START} A 88 42 -22 0 1 ${SEAM_END}`}
            fill="none"
            stroke="#fff6e4"
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeDasharray="5 6.5"
            opacity="0.88"
          />
        </g>
      </g>

      {/* ------------------------------------------------------ stays with the
          light. Order matters: key lifts the lit face, shade drops the rest,
          rim and specular sit on top of both. */}
      <circle cx="100" cy="100" r="88" fill={`url(#${u("key")})`} />
      <circle cx="100" cy="100" r="88" fill={`url(#${u("shade")})`} />
      <circle cx="100" cy="100" r="88" fill={`url(#${u("rim")})`} />
      <ellipse cx="128" cy="60" rx="34" ry="26" fill={`url(#${u("spec")})`} transform="rotate(-24 128 60)" />
    </svg>
  );
}
