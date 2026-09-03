# launch.anapp.now

Top-of-funnel campaign site for [Chovy](https://chovy.com). One job: get a
visitor to type an app idea and carry it straight into Chovy without retyping.

Next.js 16, TypeScript, pnpm, Node 24. No database: ideas and funnel events are
forwarded server-to-server to Chovy's campaign API (`chovy-ai` repo,
`/api/campaign/*`), which is where the experiment report lives.

## Run

```
pnpm install
cp .env.example .env      # fill CHOVY_CAMPAIGN_SECRET (same value as Chovy's CAMPAIGN_SECRET)
pnpm dev
```

`pnpm test` runs the unit tests (allocation, cookie, validation) with `node --test`.
`pnpm build` type-checks and builds. `pnpm creatives:placeholders` regenerates the
stand-in hero images (see below).

## How it fits together

```
visitor ── GET /            proxy.ts assigns hero variant + anonymous session (cookies)
        ── POST /api/campaign/start   idea → validated → POST {CHOVY}/api/campaign/contexts (Bearer secret)
                                      ← { handoff_url: https://chovy.com/start?c=<token> }
        ── navigate handoff_url       Chovy sets its own cookie, opens sign-up, prefills the intake
        ── POST /api/campaign/events  first-party funnel events → POST {CHOVY}/api/campaign/events
```

The idea travels only in the two JSON POST bodies. It is never in a URL, a
cookie, a log line, or an analytics payload (the event schema has no field for
it and unknown properties are dropped).

## Experiment

Four mutually exclusive hero variants, assigned once per visitor by `src/proxy.ts`
and kept in the `lan_variant` cookie for 90 days:

| variant | creative |
|---|---|
| `hero_control` | typography + input only |
| `hero_fish_builder` | `creative-a-fish-builder.png` |
| `hero_phone_rocket` | `creative-b-phone-rocket.png` |
| `hero_fish_no_code` | `creative-c-fish-no-code.png` |

Allocation is `HERO_ALLOCATION` (weights, read per request, so a Railway variable
change is enough). Changing `EXPERIMENT_ID` reassigns everyone. `?hero=<variant>`
forces a variant for QA and persists it.

Only the assigned creative is rendered, so only one image loads. The current
image files are labelled stand-ins; drop the supplied artwork over them
(`public/marketing/launch-anapp-now/README.md`).

## Events

`campaign_landing_view`, `experiment_assigned`, `creative_impression`,
`hero_input_focus`, `idea_input_started`, `idea_submitted`, `handoff_started`,
`handoff_completed`, `handoff_failed`, `cta_click`, `section_view`. Chovy adds
`handoff_opened`, `signup_completed`, `plan_generated`, `project_started` on its
side, keyed by the same anonymous session, and reports everything at
`https://chovy.com/campaign/report?key=<CAMPAIGN_SECRET>` (JSON twin at
`/api/campaign/report`).

## Deploy

Railway service from this repo (Nixpacks, `pnpm start`, health check `/healthz`).
Variables: see `.env.example`. Point `launch.anapp.now` at the service's domain
and set `SITE_ORIGIN=https://launch.anapp.now`. The apex `anapp.now` should 301
to the campaign host.
