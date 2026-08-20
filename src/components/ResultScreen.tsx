import type { Claim } from '../types'
import { outcomeDescription, outcomeLabel, outcomeMark } from '../outcomeMeta'

interface Props {
  claim: Claim
  onNewClaim: () => void
  onViewDashboard: () => void
}

export default function ResultScreen({ claim, onNewClaim, onViewDashboard }: Props) {
  const { result, input } = claim

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Routing decision · {claim.id}</div>
        <h1 className="page-title">{input.claimantName || 'Unnamed claimant'}</h1>
        <p className="page-subtitle">
          {input.vehicleYear} {input.vehicleMake} {input.vehicleModel} · Submitted{' '}
          {new Date(claim.submittedAt).toLocaleString()}
        </p>
      </div>

      <div className="result-grid">
        <div className="stamp-panel">
          <div className={`stamp ${result.outcome}`}>
            {outcomeMark[result.outcome]} {outcomeLabel[result.outcome]}
          </div>
          <div className="stamp-meta">
            <div>
              <b>{result.triggers.length}</b> rule{result.triggers.length === 1 ? '' : 's'} evaluated
            </div>
            <div>Claim {claim.id}</div>
          </div>
        </div>

        <div>
          <div className="summary-card">
            <p>{result.summary}</p>
          </div>

          <h2 className="ledger-title">Rule ledger — why this outcome</h2>
          <div className="ledger">
            {result.triggers.length === 0 ? (
              <div className="ledger-empty">No rules were triggered by this claim's details.</div>
            ) : (
              result.triggers.map((t) => (
                <div className="ledger-row" key={t.id}>
                  <span className={`ledger-mark ${t.leansTo}`}>{outcomeMark[t.leansTo]}</span>
                  <div className="ledger-copy">
                    <strong>{t.label}</strong>
                    <span>{t.detail}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 10 }}>
            {outcomeDescription[result.outcome]}
          </p>

          <div className="claim-facts">
            <span className="ledger-title" style={{ margin: 0 }}>
              Claim record
            </span>
            <dl className="facts-grid">
              <div className="fact">
                <dt>Incident type</dt>
                <dd>{input.incidentType.replace('-', ' ')}</dd>
              </div>
              <div className="fact">
                <dt>Incident date</dt>
                <dd>{input.incidentDate || '—'}</dd>
              </div>
              <div className="fact">
                <dt>Location</dt>
                <dd>{input.incidentLocation || '—'}</dd>
              </div>
              <div className="fact">
                <dt>Estimated damage</dt>
                <dd>{input.estimatedDamageAmount ? `$${input.estimatedDamageAmount}` : '—'}</dd>
              </div>
              <div className="fact">
                <dt>Police report filed</dt>
                <dd>{input.policeReportFiled ? 'Yes' : 'No'}</dd>
              </div>
              <div className="fact">
                <dt>Injuries reported</dt>
                <dd>{input.injuriesReported ? 'Yes' : 'No'}</dd>
              </div>
              <div className="fact">
                <dt>Photo evidence</dt>
                <dd>{input.hasPhotoEvidence ? 'Yes' : 'No'}</dd>
              </div>
              <div className="fact">
                <dt>Conflicting statements</dt>
                <dd>{input.conflictingStatements ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </div>

          <div className="result-actions">
            <button className="btn btn-secondary" onClick={onViewDashboard}>
              View dashboard
            </button>
            <button className="btn btn-primary" onClick={onNewClaim}>
              Submit another claim →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
