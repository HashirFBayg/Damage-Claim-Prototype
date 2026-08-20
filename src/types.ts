export type IncidentType =
  | 'rear-end'
  | 'intersection'
  | 'parking-lot'
  | 'single-vehicle'
  | 'hit-and-run'
  | 'other'

export type Outcome = 'CLEAR_FAULT' | 'NEEDS_REVIEW' | 'DISPUTED'

export interface ClaimInput {
  // Claimant information
  claimantName: string
  claimantPhone: string
  claimantEmail: string
  policyNumber: string

  // Vehicle information
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  licensePlate: string

  // Incident description
  incidentDate: string
  incidentLocation: string
  incidentType: IncidentType
  incidentDescription: string
  estimatedDamageAmount: string // kept as string from form input, parsed by engine
  policeReportFiled: boolean
  injuriesReported: boolean
  otherPartyAdmittedFault: boolean
  witnessesPresent: boolean

  // Evidence
  hasPhotoEvidence: boolean
  conflictingStatements: boolean
}

export interface RuleTrigger {
  id: string
  label: string
  detail: string
  leansTo: Outcome
}

export interface RoutingResult {
  outcome: Outcome
  triggers: RuleTrigger[]
  summary: string
}

export interface Claim {
  id: string
  submittedAt: string
  input: ClaimInput
  result: RoutingResult
}
