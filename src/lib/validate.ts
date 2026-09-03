export const IDEA_MIN = 8;
export const IDEA_MAX = 2000;

export type IdeaCheck = { ok: true; idea: string } | { ok: false; message: string };

/** Minimal validation: enough to stop empty/garbage submissions without
 * rejecting a genuinely rough sentence. */
export function checkIdea(raw: unknown): IdeaCheck {
  if (typeof raw !== "string") return { ok: false, message: "Give us the rough version. One sentence is enough." };
  const idea = raw.replace(/\s+/g, " ").trim();
  if (idea.length < IDEA_MIN) return { ok: false, message: "Give us the rough version. One sentence is enough." };
  if (idea.length > IDEA_MAX) return { ok: false, message: `Keep it under ${IDEA_MAX} characters for now. You can add more inside Chovy.` };
  const letters = idea.replace(/[^\p{L}]/gu, "").length;
  if (letters < 5) return { ok: false, message: "That doesn't look like a sentence yet. What should the app do?" };
  if (/https?:\/\/\S+/i.test(idea) && letters < 20) return { ok: false, message: "A link alone isn't enough. Say what the app should do." };
  return { ok: true, idea };
}
