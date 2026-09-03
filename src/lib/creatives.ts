import type { Variant } from "./experiment.ts";

export type Creative = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Visible campaign line printed inside the artwork, repeated in HTML so it
   * never lives only in a bitmap. */
  line: string;
};

const BASE = "/marketing/launch-anapp-now";

export const CREATIVES: Record<Exclude<Variant, "hero_control">, Creative> = {
  hero_fish_builder: {
    src: `${BASE}/creative-a-fish-builder.png`,
    width: 1600,
    height: 1200,
    alt: 'Chovy fish character working at a laptop beside the message "You describe the idea. We handle the build."',
    line: "You describe the idea. We handle the build.",
  },
  hero_phone_rocket: {
    src: `${BASE}/creative-b-phone-rocket.png`,
    width: 1600,
    height: 1200,
    alt: 'Smartphone launching a rocket beside the message "Ship your app idea."',
    line: "Ship your app idea.",
  },
  hero_fish_no_code: {
    src: `${BASE}/creative-c-fish-no-code.png`,
    width: 1600,
    height: 1200,
    alt: 'Chovy fish beside a laptop displaying code with the message "From idea to app — without learning to code."',
    line: "From idea to app, without learning to code.",
  },
};

export function creativeFor(variant: Variant): Creative | null {
  return variant === "hero_control" ? null : CREATIVES[variant];
}
