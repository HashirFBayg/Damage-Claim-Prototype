# Claim Intake & Automated Routing — Prototype

A focused vertical slice of a damage-claim workflow: an operator enters claim
details, submits, and the routing engine evaluates the claim and returns one
of three outcomes with a full explanation.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## What's here

- **Claim intake form** (`src/components/ClaimIntakeForm.tsx`) — claimant info,
  vehicle info, incident description, and evidence toggles (photo evidence,
  conflicting statements).
- **Routing engine** (`src/engine/routingEngine.ts`) — a small, explicit set of
  rule functions. Each rule inspects the claim and, if triggered, contributes
  a plain-language reason toward one of the three outcomes. Priority order is
  `DISPUTED > NEEDS_REVIEW > CLEAR_FAULT`.
- **Result screen** (`src/components/ResultScreen.tsx`) — shows the routed
  outcome as a stamp, plus a "rule ledger" listing exactly which rules fired
  and why.
- **Dashboard** (`src/components/Dashboard.tsx`) — a filterable table of every
  claim submitted this session (seeded with 3 sample claims), click a row to
  revisit its decision.

All state is in-memory (React state) for the session — no backend, no auth,
no external APIs, per the assessment scope.

## Routing rules (summary)

| Signal | Leans toward |
|---|---|
| Conflicting statements | DISPUTED |
| Hit-and-run | DISPUTED |
| No photo evidence | NEEDS REVIEW |
| Injuries reported | NEEDS REVIEW |
| No police report (multi-party) | NEEDS REVIEW |
| Estimated damage ≥ $15,000 | NEEDS REVIEW |
| No witnesses, intersection incident | NEEDS REVIEW |
| Other party admitted fault | CLEAR FAULT |
| Rear-end collision | CLEAR FAULT |
| Single-vehicle incident | CLEAR FAULT |

If any DISPUTED signal fires, the claim is routed DISPUTED regardless of
other signals. Otherwise, if any NEEDS REVIEW signal fires, it's routed
NEEDS REVIEW. Otherwise, if a CLEAR FAULT signal fired, it's CLEAR FAULT. If
nothing fired at all, it defaults to NEEDS REVIEW (a safe fallback — nothing
auto-clears without a specific reason to).
