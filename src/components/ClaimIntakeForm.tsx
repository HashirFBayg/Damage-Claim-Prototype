import { useState } from 'react'
import type { ClaimInput, IncidentType } from '../types'

const emptyClaim: ClaimInput = {
  claimantName: '',
  claimantPhone: '',
  claimantEmail: '',
  policyNumber: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  licensePlate: '',
  incidentDate: '',
  incidentLocation: '',
  incidentType: 'rear-end',
  incidentDescription: '',
  estimatedDamageAmount: '',
  policeReportFiled: false,
  injuriesReported: false,
  otherPartyAdmittedFault: false,
  witnessesPresent: false,
  hasPhotoEvidence: false,
  conflictingStatements: false,
}

const incidentTypeOptions: { value: IncidentType; label: string }[] = [
  { value: 'rear-end', label: 'Rear-end collision' },
  { value: 'intersection', label: 'Intersection collision' },
  { value: 'parking-lot', label: 'Parking lot incident' },
  { value: 'single-vehicle', label: 'Single-vehicle incident' },
  { value: 'hit-and-run', label: 'Hit-and-run' },
  { value: 'other', label: 'Other' },
]

interface Props {
  onSubmit: (claim: ClaimInput) => void
}

export default function ClaimIntakeForm({ onSubmit }: Props) {
  const [claim, setClaim] = useState<ClaimInput>(emptyClaim)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof ClaimInput>(key: K, value: ClaimInput[K]) => {
    setClaim((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !claim.claimantName.trim() ||
      !claim.incidentDate ||
      !claim.incidentDescription.trim() ||
      !claim.vehicleMake.trim() ||
      !claim.vehicleModel.trim()
    ) {
      setError('Please fill in claimant name, vehicle make/model, incident date, and a description before submitting.')
      return
    }
    setError(null)
    onSubmit(claim)
    setClaim(emptyClaim)
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}

      <section className="form-section">
        <div className="section-heading">
          <span className="section-number">01</span>
          <span className="section-title">Claimant information</span>
        </div>
        <div className="field-grid">
          <div className="field span-2">
            <label htmlFor="claimantName">Full name</label>
            <input
              id="claimantName"
              type="text"
              value={claim.claimantName}
              onChange={(e) => update('claimantName', e.target.value)}
              placeholder="Jordan Blake"
            />
          </div>
          <div className="field">
            <label htmlFor="claimantPhone">Phone</label>
            <input
              id="claimantPhone"
              type="tel"
              value={claim.claimantPhone}
              onChange={(e) => update('claimantPhone', e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
          <div className="field">
            <label htmlFor="claimantEmail">Email</label>
            <input
              id="claimantEmail"
              type="email"
              value={claim.claimantEmail}
              onChange={(e) => update('claimantEmail', e.target.value)}
              placeholder="jordan@example.com"
            />
          </div>
          <div className="field span-2">
            <label htmlFor="policyNumber">Policy number</label>
            <input
              id="policyNumber"
              type="text"
              value={claim.policyNumber}
              onChange={(e) => update('policyNumber', e.target.value)}
              placeholder="PN-00000"
            />
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <span className="section-number">02</span>
          <span className="section-title">Vehicle information</span>
        </div>
        <div className="field-grid cols-4">
          <div className="field">
            <label htmlFor="vehicleYear">Year</label>
            <input
              id="vehicleYear"
              type="text"
              value={claim.vehicleYear}
              onChange={(e) => update('vehicleYear', e.target.value)}
              placeholder="2022"
            />
          </div>
          <div className="field">
            <label htmlFor="vehicleMake">Make</label>
            <input
              id="vehicleMake"
              type="text"
              value={claim.vehicleMake}
              onChange={(e) => update('vehicleMake', e.target.value)}
              placeholder="Toyota"
            />
          </div>
          <div className="field">
            <label htmlFor="vehicleModel">Model</label>
            <input
              id="vehicleModel"
              type="text"
              value={claim.vehicleModel}
              onChange={(e) => update('vehicleModel', e.target.value)}
              placeholder="Camry"
            />
          </div>
          <div className="field">
            <label htmlFor="licensePlate">License plate</label>
            <input
              id="licensePlate"
              type="text"
              value={claim.licensePlate}
              onChange={(e) => update('licensePlate', e.target.value)}
              placeholder="ABC-1234"
            />
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <span className="section-number">03</span>
          <span className="section-title">Incident description</span>
        </div>
        <div className="field-grid" style={{ marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="incidentDate">Date of incident</label>
            <input
              id="incidentDate"
              type="date"
              value={claim.incidentDate}
              onChange={(e) => update('incidentDate', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="incidentType">Incident type</label>
            <select
              id="incidentType"
              value={claim.incidentType}
              onChange={(e) => update('incidentType', e.target.value as IncidentType)}
            >
              {incidentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field span-2">
            <label htmlFor="incidentLocation">Location</label>
            <input
              id="incidentLocation"
              type="text"
              value={claim.incidentLocation}
              onChange={(e) => update('incidentLocation', e.target.value)}
              placeholder="Street & cross street, city"
            />
          </div>
          <div className="field span-2">
            <label htmlFor="incidentDescription">
              Narrative <span className="hint">— what happened, in the claimant's words</span>
            </label>
            <textarea
              id="incidentDescription"
              value={claim.incidentDescription}
              onChange={(e) => update('incidentDescription', e.target.value)}
              placeholder="Describe the sequence of events..."
            />
          </div>
          <div className="field">
            <label htmlFor="estimatedDamageAmount">Estimated damage ($)</label>
            <input
              id="estimatedDamageAmount"
              type="number"
              min={0}
              value={claim.estimatedDamageAmount}
              onChange={(e) => update('estimatedDamageAmount', e.target.value)}
              placeholder="3200"
            />
          </div>
        </div>

        <div className="toggle-row">
          <label className={`toggle ${claim.policeReportFiled ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={claim.policeReportFiled}
              onChange={(e) => update('policeReportFiled', e.target.checked)}
            />
            <span className="toggle-copy">
              <strong>Police report filed</strong>
              <span>An official report was filed at the scene or after.</span>
            </span>
          </label>
          <label className={`toggle ${claim.injuriesReported ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={claim.injuriesReported}
              onChange={(e) => update('injuriesReported', e.target.checked)}
            />
            <span className="toggle-copy">
              <strong>Injuries reported</strong>
              <span>Any party reported an injury from the incident.</span>
            </span>
          </label>
          <label className={`toggle ${claim.otherPartyAdmittedFault ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={claim.otherPartyAdmittedFault}
              onChange={(e) => update('otherPartyAdmittedFault', e.target.checked)}
            />
            <span className="toggle-copy">
              <strong>Other party admitted fault</strong>
              <span>The other driver acknowledged fault at the scene or in a statement.</span>
            </span>
          </label>
          <label className={`toggle ${claim.witnessesPresent ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={claim.witnessesPresent}
              onChange={(e) => update('witnessesPresent', e.target.checked)}
            />
            <span className="toggle-copy">
              <strong>Witnesses present</strong>
              <span>An independent witness was on scene.</span>
            </span>
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <span className="section-number">04</span>
          <span className="section-title">Evidence</span>
        </div>
        <div className="toggle-row">
          <label className={`toggle ${claim.hasPhotoEvidence ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={claim.hasPhotoEvidence}
              onChange={(e) => update('hasPhotoEvidence', e.target.checked)}
            />
            <span className="toggle-copy">
              <strong>Photo evidence available</strong>
              <span>Photos of the vehicles or scene were submitted with the claim.</span>
            </span>
          </label>
          <label className={`toggle ${claim.conflictingStatements ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={claim.conflictingStatements}
              onChange={(e) => update('conflictingStatements', e.target.checked)}
            />
            <span className="toggle-copy">
              <strong>Statements are conflicting</strong>
              <span>The parties' accounts of what happened do not agree.</span>
            </span>
          </label>
        </div>
      </section>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setClaim(emptyClaim)
            setError(null)
          }}
        >
          Clear form
        </button>
        <button type="submit" className="btn btn-primary">
          Submit claim →
        </button>
      </div>
    </form>
  )
}
