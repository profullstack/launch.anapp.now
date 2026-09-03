import Image from "next/image";
import type { Variant } from "@/lib/experiment.ts";
import { creativeFor } from "@/lib/creatives.ts";
import IdeaForm from "./IdeaForm.tsx";

const COPY: Record<Variant, { eyebrow: string; title: React.ReactNode; lede: string; support?: string }> = {
  hero_control: {
    eyebrow: "You have an idea.",
    title: (<>Launch an app.<br />Now<span className="now">.</span></>),
    lede: "You already know the product. Describe the screens, flow, users, or outcome. Chovy handles the engineering execution.",
  },
  hero_fish_builder: {
    eyebrow: "You have an idea.",
    title: (<>Launch an app.<br />Now<span className="now">.</span></>),
    lede: "Describe it in plain English. Chovy handles the technical workflow.",
  },
  hero_phone_rocket: {
    eyebrow: "Still in your head?",
    title: (<>Ship the<br />app idea<span className="now">.</span></>),
    lede: "It's been in your head long enough.",
  },
  hero_fish_no_code: {
    eyebrow: "For people who know what to build",
    title: (<>Have the idea.<br />Skip the<br />coding career<span className="now">.</span></>),
    lede: "Tell Chovy what the app should do. Start with one sentence.",
  },
};

export default function Hero({ variant, chovyOrigin }: { variant: Variant; chovyOrigin: string }) {
  const copy = COPY[variant];
  const creative = creativeFor(variant);
  const tone = variant === "hero_phone_rocket" ? "rocket" : variant === "hero_fish_no_code" ? "dark" : "";
  return (
    <section className={`hero ${creative ? "has-art" : ""} ${tone}`.trim()} aria-labelledby="hero-title" data-variant={variant}>
      <div className="wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">{copy.eyebrow}</p>
          <h1 className="display" id="hero-title">{copy.title}</h1>
          <p className="lede hero-lede">{copy.lede}</p>
          <IdeaForm surface="hero" />
          <p className="trust">
            <span>One sentence is enough</span>
            <span>You own the code</span>
            <span>Nothing publishes without your approval</span>
          </p>
          <a className="powered" href={chovyOrigin} rel="noopener">
            <span>Powered by</span>
            <img src={tone === "dark" ? "/chovy-logo-dark.png" : "/chovy-logo.png"} alt="Chovy" width={2172} height={724} />
          </a>
        </div>
        {creative && (
          <figure className="hero-art" data-creative={variant}>
            {/* Only the assigned creative is rendered, so only one image is fetched. */}
            <Image src={creative.src} alt={creative.alt} width={creative.width} height={creative.height} priority sizes="(min-width: 900px) 48vw, 92vw" />
            <figcaption>{creative.line}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
