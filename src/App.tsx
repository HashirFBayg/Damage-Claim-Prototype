import { useState } from 'react'
import ClaimIntakeForm from './components/ClaimIntakeForm'
import ResultScreen from './components/ResultScreen'
import Dashboard from './components/Dashboard'
import { evaluateClaim } from './engine/routingEngine'
import { seedClaims } from './data/seedClaims'
import type { Claim, ClaimInput } from './types'

type View = 'INTAKE' | 'RESULT' | 'DASHBOARD'

let claimCounter = seedClaims.length + 1000

export default function App() {
  const [claims, setClaims] = useState<Claim[]>(seedClaims)
  const [view, setView] = useState<View>('INTAKE')
  const [activeClaim, setActiveClaim] = useState<Claim | null>(null)

  const handleSubmit = (input: ClaimInput) => {
    const claim: Claim = {
      id: `CLM-${claimCounter++}`,
      submittedAt: new Date().toISOString(),
      input,
      result: evaluateClaim(input),
    }
    setClaims((prev) => [claim, ...prev])
    setActiveClaim(claim)
    setView('RESULT')
  }

  const handleSelectClaim = (claim: Claim) => {
    setActiveClaim(claim)
    setView('RESULT')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-mark">CIR</span>
          <span className="topbar-title">Claim Intake &amp; Routing</span>
        </div>
        <nav className="topbar-nav">
          <button className={view === 'INTAKE' ? 'active' : ''} onClick={() => setView('INTAKE')}>
            New Claim
          </button>
          <button className={view === 'DASHBOARD' ? 'active' : ''} onClick={() => setView('DASHBOARD')}>
            Dashboard
          </button>
        </nav>
      </header>

      <main className="main">
        {view === 'INTAKE' && (
          <>
            <div className="page-header">
              <div className="page-eyebrow">New submission</div>
              <h1 className="page-title">Claim intake</h1>
              <p className="page-subtitle">
                Enter the claimant, vehicle, and incident details below. On submission, the routing engine
                evaluates the claim and returns a decision with a full explanation.
              </p>
            </div>
            <ClaimIntakeForm onSubmit={handleSubmit} />
          </>
        )}

        {view === 'RESULT' && activeClaim && (
          <ResultScreen
            claim={activeClaim}
            onNewClaim={() => setView('INTAKE')}
            onViewDashboard={() => setView('DASHBOARD')}
          />
        )}

        {view === 'DASHBOARD' && (
          <Dashboard claims={claims} onSelectClaim={handleSelectClaim} onNewClaim={() => setView('INTAKE')} />
        )}
      </main>
    </div>
  )
}
