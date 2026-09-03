"use client";
import { track } from "@/lib/track.ts";

/** Nav CTA: jumps to the hero input rather than to a separate page. */
export default function StartLink() {
  return (
    <a
      className="btn compact"
      href="#idea"
      onClick={(event) => {
        event.preventDefault();
        track("cta_click", { surface: "nav" });
        const field = document.getElementById("idea") as HTMLTextAreaElement | null;
        field?.scrollIntoView({ behavior: "smooth", block: "center" });
        field?.focus({ preventScroll: true });
      }}
    >
      Start <span className="arrow" aria-hidden="true">→</span>
    </a>
  );
}
