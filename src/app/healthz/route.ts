import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env.ts";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, service: "launch.anapp.now", commit: runtimeEnv("RAILWAY_GIT_COMMIT_SHA", "dev").slice(0, 12) },
    { headers: { "cache-control": "no-store" } },
  );
}
