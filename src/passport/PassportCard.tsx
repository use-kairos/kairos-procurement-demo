import './passport.css'

export const PASSPORT = {
  agent: 'Pip · Procurement agent',
  owner: 'Alex Lim · Lim Bakery Pte. Ltd.',
  limit: '≤ SGD 1,000 per payment',
  payees: 'Known suppliers only',
  validUntil: '28 Oct 2035',
  algorithm: 'ML-DSA-65',
  fingerprint: 'a1f3 9e07 … 4c2b',
}

type Props = { compact?: boolean }

export default function PassportCard({ compact = false }: Props) {
  const rows: [string, string][] = [
    ['Agent', PASSPORT.agent],
    ['Owner', PASSPORT.owner],
    ['Limit', PASSPORT.limit],
    ['Payees', PASSPORT.payees],
    ['Valid until', PASSPORT.validUntil],
  ]

  return (
    <div className={`passport${compact ? ' passport--compact' : ''}`}>
      <div className="passport__head">
        <span className="passport__kicker">Agent passport</span>
        <span className="passport__issuer">Issued by Kairos</span>
      </div>
      <dl className="passport__rows">
        {rows.map(([k, v]) => (
          <div key={k} className="passport__row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="passport__seal">
        <span className="passport__stamp" aria-hidden>
          ✓
        </span>
        <div>
          <div className="passport__sig">Signed · {PASSPORT.algorithm}</div>
          <div className="passport__fp">{PASSPORT.fingerprint}</div>
        </div>
      </div>
    </div>
  )
}
