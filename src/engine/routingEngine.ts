import type { ClaimInput, Outcome, RoutingResult, RuleTrigger } from '../types'

/**
 * ROUTING ENGINE
 * ---------------------------------------------------------------------------
 * A small, deterministic rule set that evaluates a submitted claim and
 * routes it to one of three outcomes: CLEAR_FAULT, NEEDS_REVIEW, DISPUTED.
 *
 * Design:
 *  - Every rule is a plain function that inspects the claim and, if its
 *    condition holds, contributes a "trigger" explaining what it found and
 *    which outcome it leans toward.
 *  - Priority is DISPUTED > NEEDS_REVIEW > CLEAR_FAULT. Conflicting accounts
 *    always require human resolution first; anything with missing or
 *    ambiguous information gets a second look; only claims with a clean,
 *    corroborated, unambiguous picture are auto-cleared.
 *  - The explanation shown to the operator is just the list of triggers
 *    that fired, so the decision is never a black box.
 */

type Rule = (claim: ClaimInput) => RuleTrigger | null

const parsedDamageAmount = (claim: ClaimInput): number => {
  const n = Number(claim.estimatedDamageAmount.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const rules: Rule[] = [
  // ---- DISPUTED signals ----
  (claim) =>
    claim.conflictingStatements
      ? {
          id: 'conflicting-statements',
          label: 'Conflicting statements',
          detail:
            'The parties involved gave accounts that do not agree. This must be resolved by an adjuster before liability can be assigned.',
          leansTo: 'DISPUTED',
        }
      : null,

  (claim) =>
    claim.incidentType === 'hit-and-run'
      ? {
          id: 'hit-and-run',
          label: 'Hit-and-run incident',
          detail: 'The at-fault party left the scene, so fault cannot be confirmed from one side alone.',
          leansTo: 'DISPUTED',
        }
      : null,

  // ---- NEEDS_REVIEW signals ----
  (claim) =>
    !claim.hasPhotoEvidence
      ? {
          id: 'no-photo-evidence',
          label: 'No photo evidence on file',
          detail: 'There is no photo evidence to corroborate the description of the incident.',
          leansTo: 'NEEDS_REVIEW',
        }
      : null,

  (claim) =>
    claim.injuriesReported
      ? {
          id: 'injuries-reported',
          label: 'Injuries reported',
          detail: 'Claims involving reported injuries are always routed to manual review, regardless of fault clarity.',
          leansTo: 'NEEDS_REVIEW',
        }
      : null,

  (claim) =>
    !claim.policeReportFiled && claim.incidentType !== 'single-vehicle'
      ? {
          id: 'no-police-report',
          label: 'No police report filed',
          detail: 'A multi-party incident with no official report has less corroborating documentation.',
          leansTo: 'NEEDS_REVIEW',
        }
      : null,

  (claim) =>
    parsedDamageAmount(claim) >= 15000
      ? {
          id: 'high-damage-amount',
          label: 'High estimated damage amount',
          detail: `Estimated damage of $${parsedDamageAmount(claim).toLocaleString()} exceeds the $15,000 auto-clear threshold.`,
          leansTo: 'NEEDS_REVIEW',
        }
      : null,

  (claim) =>
    !claim.witnessesPresent && claim.incidentType === 'intersection'
      ? {
          id: 'no-witnesses-intersection',
          label: 'No witnesses at an intersection incident',
          detail: 'Intersection incidents without witnesses are harder to corroborate one-sidedly.',
          leansTo: 'NEEDS_REVIEW',
        }
      : null,

  // ---- CLEAR_FAULT signals ----
  (claim) =>
    claim.otherPartyAdmittedFault
      ? {
          id: 'fault-admitted',
          label: 'Other party admitted fault',
          detail: 'The other party admitted fault at the scene or in a statement.',
          leansTo: 'CLEAR_FAULT',
        }
      : null,

  (claim) =>
    claim.incidentType === 'rear-end'
      ? {
          id: 'rear-end-presumption',
          label: 'Rear-end collision',
          detail: 'Rear-end collisions carry a standard presumption of fault against the rear driver.',
          leansTo: 'CLEAR_FAULT',
        }
      : null,

  (claim) =>
    claim.incidentType === 'single-vehicle'
      ? {
          id: 'single-vehicle',
          label: 'Single-vehicle incident',
          detail: 'Only one vehicle was involved, so there is no other party to dispute liability.',
          leansTo: 'CLEAR_FAULT',
        }
      : null,
]

const priority: Outcome[] = ['DISPUTED', 'NEEDS_REVIEW', 'CLEAR_FAULT']

const summaryFor = (outcome: Outcome, triggers: RuleTrigger[]): string => {
  const relevant = triggers.filter((t) => t.leansTo === outcome)
  switch (outcome) {
    case 'DISPUTED':
      return `Routed to Disputed because ${relevant.length} conflict indicator${
        relevant.length === 1 ? '' : 's'
      } fired. An adjuster needs to reconcile the accounts before liability can be assigned.`
    case 'NEEDS_REVIEW':
      return `Routed to Needs Review because ${relevant.length} factor${
        relevant.length === 1 ? '' : 's'
      } left the picture incomplete or above auto-clear thresholds.`
    case 'CLEAR_FAULT':
      return relevant.length
        ? 'Routed to Clear Fault: liability is well-supported and no review or dispute signals were found.'
        : 'Routed to Clear Fault by default: no dispute or review signals were found, and evidence and documentation are complete.'
  }
}

export function evaluateClaim(claim: ClaimInput): RoutingResult {
  const triggers = rules.map((rule) => rule(claim)).filter((t): t is RuleTrigger => t !== null)

  const firedOutcomes = new Set(triggers.map((t) => t.leansTo))
  const outcome = priority.find((o) => firedOutcomes.has(o)) ?? 'NEEDS_REVIEW'

  return {
    outcome,
    triggers,
    summary: summaryFor(outcome, triggers),
  }
}
