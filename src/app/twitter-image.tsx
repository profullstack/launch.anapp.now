import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "You have the idea. Launch it. launch.anapp.now, powered by Chovy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Control creative for social cards. Channel-specific creatives are measured
// separately (PRD §13/§50); switch the default here once data justifies it.
export default async function OpenGraphImage() {
  const geist = await readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf")).catch(() => null);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a1230", color: "#fff", padding: 64, fontFamily: geist ? "Geist" : "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, color: "#ffd23f" }}>YOU HAVE AN IDEA.</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, lineHeight: 0.9, letterSpacing: -8, fontWeight: 900 }}>
          <span>Launch an app.</span>
          <span style={{ display: "flex" }}>Now<span style={{ color: "#ff6a1a" }}>.</span></span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 34 }}>
          <span style={{ display: "flex" }}>launch<span style={{ color: "#ffd23f" }}>.</span>anapp<span style={{ color: "#ffd23f" }}>.</span><span style={{ color: "#ff6a1a" }}>now</span></span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 28 }}>Powered by Chovy</span>
        </div>
      </div>
    ),
    { ...size, fonts: geist ? [{ name: "Geist", data: geist, weight: 900, style: "normal" }] : undefined },
  );
}
