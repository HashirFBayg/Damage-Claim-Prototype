import { evaluateClaim } from '../engine/routingEngine'
import type { Claim, ClaimInput } from '../types'

const seedInputs: Array<{ input: ClaimInput; submittedAt: string }> = [
  {
    submittedAt: '2026-08-14T09:12:00.000Z',
    input: {
      claimantName: 'Maria Alvarez',
      claimantPhone: '(555) 201-4432',
      claimantEmail: 'maria.alvarez@example.com',
      policyNumber: 'PN-88213',
      vehicleYear: '2021',
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      licensePlate: 'GHT-2291',
      incidentDate: '2026-08-12',
      incidentLocation: 'Elm St & 4th Ave, Springfield',
      incidentType: 'rear-end',
      incidentDescription:
        'Stopped at a red light and was struck from behind by the other vehicle.',
      estimatedDamageAmount: '3200',
      policeReportFiled: true,
      injuriesReported: false,
      otherPartyAdmittedFault: true,
      witnessesPresent: true,
      hasPhotoEvidence: true,
      conflictingStatements: false,
    },
  },
  {
    submittedAt: '2026-08-15T14:40:00.000Z',
    input: {
      claimantName: 'Devon Price',
      claimantPhone: '(555) 917-3320',
      claimantEmail: 'devon.price@example.com',
      policyNumber: 'PN-55021',
      vehicleYear: '2019',
      vehicleMake: 'Ford',
      vehicleModel: 'F-150',
      licensePlate: 'RTX-8814',
      incidentDate: '2026-08-15',
      incidentLocation: 'Main St & 9th, Springfield',
      incidentType: 'intersection',
      incidentDescription:
        'Collision while crossing the intersection; both drivers state the other ran the light.',
      estimatedDamageAmount: '7400',
      policeReportFiled: true,
      injuriesReported: false,
      otherPartyAdmittedFault: false,
      witnessesPresent: false,
      hasPhotoEvidence: true,
      conflictingStatements: true,
    },
  },
  {
    submittedAt: '2026-08-17T11:05:00.000Z',
    input: {
      claimantName: 'Priya Natarajan',
      claimantPhone: '(555) 402-7761',
      claimantEmail: 'priya.n@example.com',
      policyNumber: 'PN-90144',
      vehicleYear: '2023',
      vehicleMake: 'Toyota',
      vehicleModel: 'RAV4',
      licensePlate: 'LMB-5563',
      incidentDate: '2026-08-16',
      incidentLocation: 'Riverside Parking Deck, Level 3',
      incidentType: 'parking-lot',
      incidentDescription:
        'Found a dent and scrape on the passenger door after returning to the vehicle. No other party identified.',
      estimatedDamageAmount: '1800',
      policeReportFiled: false,
      injuriesReported: false,
      otherPartyAdmittedFault: false,
      witnessesPresent: false,
      hasPhotoEvidence: false,
      conflictingStatements: false,
    },
  },
]

export const seedClaims: Claim[] = seedInputs.map(({ input, submittedAt }, i) => ({
  id: `CLM-${(1000 + i).toString()}`,
  submittedAt,
  input,
  result: evaluateClaim(input),
}))
