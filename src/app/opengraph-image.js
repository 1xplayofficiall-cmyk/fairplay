import { ImageResponse } from "next/og";

import { SITE } from "@/lib/seo";

/* A generated card rather than a static asset: the only image in /public is the
   122×50 logo, and a 122px-wide PNG stretched into a 1200×630 slot is what
   makes a shared link look broken. Built at build time and cached.

   No custom font is loaded. Sora would have to be read off disk as a .ttf, and
   next/font/google keeps its files inside .next rather than at a stable path —
   the system stack renders fine at this size and cannot break the build. */
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#040506",
          backgroundImage:
            "radial-gradient(1000px 520px at 22% -10%, rgba(255,140,0,0.30), transparent 62%), radial-gradient(900px 520px at 88% 110%, rgba(0,200,83,0.24), transparent 62%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(246,248,247,0.62)",
          }}
        >
          www.fair-play.co
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
              color: "#f6f8f7",
            }}
          >
            Every match. Every move.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
              color: "#ff8c00",
            }}
          >
            One FairPlay.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 27,
            color: "rgba(246,248,247,0.78)",
          }}
        >
          <span>Sportsbook</span>
          <span style={{ color: "#00c853" }}>·</span>
          <span>Live casino</span>
          <span style={{ color: "#00c853" }}>·</span>
          <span>India</span>
          <span style={{ color: "#00c853" }}>·</span>
          <span>18+</span>
        </div>
      </div>
    ),
    size
  );
}
