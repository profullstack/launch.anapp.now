import type { Metadata } from "next";
import Nav from "@/components/Nav.tsx";
import { Footer } from "@/components/Sections.tsx";
import { chovyOrigin } from "@/lib/env.ts";

export const metadata: Metadata = {
  title: "Privacy | launch.anapp.now",
  description: "What launch.anapp.now collects, where an app idea goes, and what never happens to it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const chovy = chovyOrigin();
  return (
    <>
      <Nav chovyOrigin={chovy} />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="eyebrow">Privacy</p>
          <h1 className="h2" style={{ marginTop: "0.6rem" }}>Your idea stays yours.</h1>
          <div style={{ display: "grid", gap: "1.6rem", marginTop: "2rem", fontSize: "1.05rem", lineHeight: 1.6 }}>
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>What this site collects</h2>
              <p>The sentence you type into the idea field, the moment you submit it. Until then it is held only in your browser. We also set first-party cookies: an anonymous session id, which hero design you were shown (so it stays the same on your next visit), and the campaign parameters from the link you arrived on, such as <code>utm_source</code>.</p>
            </section>
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>Where your idea goes</h2>
              <p>Straight to Chovy, over an encrypted server-to-server request, so it is waiting for you when you sign in. It becomes the first note of your Chovy project and is private to your workspace.</p>
            </section>
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>What never happens to it</h2>
              <p>It is never placed in a URL, never sent to an advertising or analytics platform, never shown publicly, and never used to train anything. The funnel events we record (a page view, a click on the button) contain no text you typed.</p>
            </section>
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>Retention and contact</h2>
              <p>An idea that never becomes a Chovy project is deleted after 7 days. To have it removed sooner, or to ask anything about this page, write to <a href="mailto:hello@chovy.com">hello@chovy.com</a>. Chovy's own product terms apply once you sign in at <a href={chovy}>chovy.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer chovyOrigin={chovy} />
    </>
  );
}
