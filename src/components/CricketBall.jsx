/* ============================================================================
   CRICKET BALL
   ----------------------------------------------------------------------------
   A rendered object, not a line drawing — so it deliberately does not follow
   the conventions in Art.jsx (stroke-only, currentColor, DrawSVG-able). It is
   built from stacked radial gradients instead: leather body, terminator, a
   specular hit, and a warm rim.

   It is lit to match the hero, which floods from above and slightly right of
   the ball's position. Everything therefore keys to one direction — highlight
   upper-right, terminator and shadow lower-left. Rotating this element would
   drag the highlight around with it and break that, so it stays static and
   only drifts on parallax.

   The seam is the near half of a great circle: an elliptical arc whose ends
   land exactly on the silhouette. The stitching is the same arc offset and
   stroked with a dash pattern, which is far cheaper than drawing sixty
   individual stitches and reads identically at this size.
   ========================================================================== */

const SEAM_START = "M 18.4 133";
const SEAM_END = "181.6 67";

export default function CricketBall({ id = "ball", ...props }) {
  /* Gradient ids have to be unique per instance or a second ball on the page
     would silently inherit the first one's fills. */
  const u = (name) => `${id}-${name}`;

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <defs>
        {/* Leather. The offset centre is what makes it a sphere rather than a
            disc — a centred radial gradient always reads flat. */}
        <radialGradient id={u("body")} cx="66%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#e2635c" />
          <stop offset="30%" stopColor="#c23237" />
          <stop offset="62%" stopColor="#8d1a20" />
          <stop offset="85%" stopColor="#4e0d12" />
          <stop offset="100%" stopColor="#2a070a" />
        </radialGradient>

        {/* Terminator — deepens the lower-left away from the key light. */}
        <radialGradient id={u("shade")} cx="72%" cy="22%" r="88%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.62" />
        </radialGradient>

        {/* Specular hit, soft-edged. */}
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

        {/* Keeps the seam and its stitching from spilling past the silhouette. */}
        <clipPath id={u("clip")}>
          <circle cx="100" cy="100" r="88" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="88" fill={`url(#${u("body")})`} />

      <g clipPath={`url(#${u("clip")})`}>
        {/* Recessed join line, then the two rows of stitches either side. */}
        <path
          d={`${SEAM_START} A 88 30 -22 0 1 ${SEAM_END}`}
          fill="none"
          stroke="#3d0a0e"
          strokeWidth="3.4"
          opacity="0.85"
        />
        <path
          d={`${SEAM_START} A 88 22 -22 0 1 ${SEAM_END}`}
          fill="none"
          stroke="#f4ead6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2.5 8"
          opacity="0.78"
        />
        <path
          d={`${SEAM_START} A 88 39 -22 0 1 ${SEAM_END}`}
          fill="none"
          stroke="#f4ead6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2.5 8"
          opacity="0.68"
        />
      </g>

      {/* Shading sits above the seam so the stitches fall into shadow too. */}
      <circle cx="100" cy="100" r="88" fill={`url(#${u("shade")})`} />
      <circle cx="100" cy="100" r="88" fill={`url(#${u("rim")})`} />
      <ellipse cx="128" cy="60" rx="34" ry="26" fill={`url(#${u("spec")})`} transform="rotate(-24 128 60)" />
    </svg>
  );
}
