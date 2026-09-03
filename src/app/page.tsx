import Nav from "@/components/Nav.tsx";
import Hero from "@/components/Hero.tsx";
import Analytics from "@/components/Analytics.tsx";
import Reveal from "@/components/Reveal.tsx";
import { CompareSection, FAQ, FaqSection, FinalSection, Footer, OwnershipSection, PainSection, ProcessSection, ProofSection } from "@/components/Sections.tsx";
import { campaignSession } from "@/lib/session.ts";
import { chovyOrigin, siteOrigin } from "@/lib/env.ts";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await campaignSession();
  const chovy = chovyOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "launch.anapp.now", url: `${siteOrigin()}/`, publisher: { "@type": "Organization", name: "Chovy", url: chovy } },
      { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
  return (
    <>
      <Nav chovyOrigin={chovy} />
      <main>
        <Hero variant={session.variant} chovyOrigin={chovy} />
        <ProcessSection />
        <ProofSection />
        <PainSection />
        <OwnershipSection />
        <CompareSection />
        <FaqSection />
        <FinalSection chovyOrigin={chovy} />
      </main>
      <Footer chovyOrigin={chovy} />
      <Analytics variant={session.variant} />
      <Reveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
