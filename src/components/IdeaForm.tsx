"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { track, deviceClass, lastTouch } from "@/lib/track.ts";
import { IDEA_MAX } from "@/lib/validate.ts";
import DomainMark from "./DomainMark.tsx";

const DRAFT_KEY = "lan_idea_draft";
const EMPTY_COPY = "Give us the rough version. One sentence is enough.";
const CHIPS: Array<[label: string, starter: string]> = [
  ["Marketplace", "a marketplace where "],
  ["SaaS", "a SaaS tool that "],
  ["Booking app", "a booking app where customers can "],
  ["Customer portal", "a customer portal where "],
  ["Mobile app", "a mobile app that "],
  ["Internal tool", "an internal tool for our team that "],
];

type Stage = "idle" | "sending" | "go";

export default function IdeaForm({ surface, id = "idea", chips = true, ctaLabel = "Launch this idea" }: { surface: string; id?: string; chips?: boolean; ctaLabel?: string }) {
  const [idea, setIdea] = useState("");
  const [hint, setHint] = useState<{ text: string; tone: "info" | "error" }>({ text: "", tone: "info" });
  const [stage, setStage] = useState<Stage>("idle");
  const started = useRef(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const hintId = useId();

  // Drafts survive a reload or a failed handoff.
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      if (draft) setIdea(draft);
    } catch {}
  }, []);
  const update = (value: string) => {
    setIdea(value);
    if (hint.tone === "error") setHint({ text: "", tone: "info" });
    try { sessionStorage.setItem(DRAFT_KEY, value); } catch {}
    if (!started.current && value.trim()) {
      started.current = true;
      track("idea_input_started", { once: `started:${surface}`, surface });
    }
  };

  const useChip = (starter: string) => {
    if (!idea.trim()) update(starter);
    field.current?.focus();
    const end = field.current?.value.length ?? 0;
    field.current?.setSelectionRange(end, end);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stage !== "idle") return;
    const value = idea.replace(/\s+/g, " ").trim();
    if (value.length < 8) {
      setHint({ text: EMPTY_COPY, tone: "error" });
      field.current?.focus();
      return;
    }
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStage("sending");
    track("idea_submitted", { surface });
    track("handoff_started", { surface });
    try {
      const response = await fetch("/api/campaign/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea: value, website: honeypot, device_class: deviceClass(), last_touch: lastTouch() }),
      });
      const data = (await response.json().catch(() => ({}))) as { handoff_url?: string; detail?: string };
      if (!response.ok || !data.handoff_url) {
        track("handoff_failed", { surface, props: { status: response.status } });
        setStage("idle");
        setHint({ text: data.detail || "Something went wrong on our side. Your idea is still here. Try again.", tone: "error" });
        return;
      }
      track("handoff_completed", { surface });
      try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
      setStage("go");
      // Let the transition read as a handoff, then move to Chovy. The idea is
      // already saved server-side; nothing here depends on this delay.
      window.setTimeout(() => window.location.assign(data.handoff_url as string), 450);
    } catch {
      track("handoff_failed", { surface, props: { status: 0 } });
      setStage("idle");
      setHint({ text: "We couldn't reach Chovy just now. Your idea is still here. Try again in a moment.", tone: "error" });
    }
  };

  return (
    <>
      <form className="idea" onSubmit={submit} noValidate aria-describedby={hintId}>
        <label htmlFor={id} className="sr-only">Describe the app you want. One sentence is enough.</label>
        <div className="idea-field">
          <textarea
            id={id}
            ref={field}
            name="idea"
            rows={1}
            maxLength={IDEA_MAX}
            placeholder="I want an app that…"
            value={idea}
            onChange={(event) => update(event.target.value)}
            onFocus={() => track("hero_input_focus", { once: `focus:${surface}`, surface })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            autoComplete="off"
            spellCheck
            enterKeyHint="go"
          />
          <button className="btn primary" type="submit" disabled={stage !== "idle"} aria-live="polite">
            {stage === "idle" ? ctaLabel : "Turning that into a starting point…"}
            {stage === "idle" && <span className="arrow" aria-hidden="true">→</span>}
          </button>
        </div>
        <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <p className="idea-hint" id={hintId} data-tone={hint.tone} role={hint.tone === "error" ? "alert" : undefined}>{hint.text}</p>
        {chips && (
          <div className="chips" aria-label="Starting points">
            {CHIPS.map(([label, starter]) => (
              <button key={label} type="button" className="chip" onClick={() => useChip(starter)}>{label}</button>
            ))}
          </div>
        )}
      </form>
      {stage !== "idle" && (
        <div className="handoff" data-stage={stage} role="status" aria-live="polite">
          <div>
            <DomainMark />
            <p>{stage === "go" ? "Opening your starting point in Chovy…" : "Turning that into a starting point…"}</p>
            <div className="bar" aria-hidden="true"><i /></div>
          </div>
        </div>
      )}
    </>
  );
}
