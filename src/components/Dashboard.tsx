import { useMemo, useState } from 'react'
import type { Claim, Outcome } from '../types'
import { outcomeLabel, outcomeMark } from '../outcomeMeta'

interface Props {
  claims: Claim[]
  onSelectClaim: (claim: Claim) => void
  onNewClaim: () => void
}

type Filter = 'ALL' | Outcome

const filters: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'CLEAR_FAULT', label: 'Clear Fault' },
  { value: 'NEEDS_REVIEW', label: 'Needs Review' },
  { value: 'DISPUTED', label: 'Disputed' },
]

export default function Dashboard({ claims, onSelectClaim, onNewClaim }: Props) {
  const [filter, setFilter] = useState<Filter>('ALL')

  const visible = useMemo(() => {
    const sorted = [...claims].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    return filter === 'ALL' ? sorted : sorted.filter((c) => c.result.outcome === filter)
  }, [claims, filter])

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Claims dashboard</div>
        <h1 className="page-title">Submitted claims</h1>
        <p className="page-subtitle">Every claim routed through the engine this session, most recent first.</p>
      </div>

      <div className="dashboard-toolbar">
        <div className="filter-chips">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`chip ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value !== 'ALL' && ` (${claims.filter((c) => c.result.outcome === f.value).length})`}
              {f.value === 'ALL' && ` (${claims.length})`}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={onNewClaim}>
          New claim →
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <strong>No claims here yet</strong>
          Submit a claim to see it routed and listed on this dashboard.
        </div>
      ) : (
        <table className="claims-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Claimant</th>
              <th>Vehicle</th>
              <th>Incident type</th>
              <th>Submitted</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((claim) => (
              <tr key={claim.id} onClick={() => onSelectClaim(claim)}>
                <td className="mono">{claim.id}</td>
                <td>{claim.input.claimantName || '—'}</td>
                <td>
                  {claim.input.vehicleYear} {claim.input.vehicleMake} {claim.input.vehicleModel}
                </td>
                <td>{claim.input.incidentType.replace('-', ' ')}</td>
                <td className="mono">{new Date(claim.submittedAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${claim.result.outcome}`}>
                    {outcomeMark[claim.result.outcome]} {outcomeLabel[claim.result.outcome]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
