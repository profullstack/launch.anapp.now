"use client";
import { useEffect } from "react";
import { track } from "@/lib/track.ts";
import { COOKIE_FRESH } from "@/lib/experiment.ts";

/** Landing view, first-time assignment, creative impression, section views. */
export default function Analytics({ variant }: { variant: string }) {
  useEffect(() => {
    track("campaign_landing_view", { once: "landing", props: { variant } });
    if (document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_FRESH}=`))) {
      track("experiment_assigned", { once: "assigned", props: { variant } });
      document.cookie = `${COOKIE_FRESH}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.dataset.creative) track("creative_impression", { once: "creative", surface: "hero", props: { variant } });
          else if (el.dataset.section) track("section_view", { once: `section:${el.dataset.section}`, props: { section: el.dataset.section } });
          io.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );
    document.querySelectorAll<HTMLElement>("[data-creative],[data-section]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [variant]);
  return null;
}
