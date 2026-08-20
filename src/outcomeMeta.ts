import type { Outcome } from './types'

export const outcomeLabel: Record<Outcome, string> = {
  CLEAR_FAULT: 'Clear Fault',
  NEEDS_REVIEW: 'Needs Review',
  DISPUTED: 'Disputed',
}

export const outcomeMark: Record<Outcome, string> = {
  CLEAR_FAULT: '✓',
  NEEDS_REVIEW: '•',
  DISPUTED: '✕',
}

export const outcomeDescription: Record<Outcome, string> = {
  CLEAR_FAULT: 'Liability is clear and well-supported. Ready to proceed toward settlement.',
  NEEDS_REVIEW: 'The picture is incomplete or exceeds an auto-clear threshold. An adjuster should take a look.',
  DISPUTED: 'Accounts conflict or fault cannot be established from the record. Requires resolution before proceeding.',
}
