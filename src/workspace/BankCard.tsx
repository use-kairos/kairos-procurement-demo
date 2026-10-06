import { useState } from 'react'
import { ChevronDown, IdCard, Zap } from 'lucide-react'
import PassportCard, { PASSPORT } from '../passport/PassportCard'
import './cards.css'
import KairosMark from '../brand/KairosMark'

export function CardHead({ title }: { title: string }) {
  return (
    <header className="card-head">
      <span className="bank-mark has-kairos-mark">
        <KairosMark size={18} />
      </span>
      <span className="card-head__title">{title}</span>
      <span className="card-head__by">Kairos</span>
    </header>
  )
}

export function CheckBar({ passed, label }: { passed: number; label: string }) {
  return (
    <footer className="card-foot">
      <div className="checkbar" aria-label={`${passed} of 6 checks passed`}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={i < passed ? 'is-done' : ''} />
        ))}
      </div>
      <span className="card-foot__label">{label}</span>
    </footer>
  )
}

// Inline plugin card: the payment the agent is about to make, with the passport it presents.
export default function BankCard({ checksDone }: { checksDone: number }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="bcard">
      <CardHead title="Payment" />

      <div className="bcard__figure">
        <span className="bcard__amount num">SGD 480.00</span>
        <span className="bcard__rail">
          <Zap size={12} />
          FAST · ISO 20022
        </span>
      </div>

      <div className="payee">
        <span className="payee__mark">TS</span>
        <span className="payee__text">
          <span className="payee__name">Tan Supplies Pte. Ltd.</span>
          <span className="payee__sub">Known supplier · paid 14 times</span>
        </span>
      </div>

      <button className={`passport-row${open ? ' is-open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <IdCard size={15} />
        <span className="passport-row__text">
          Passport · {PASSPORT.agent.split(' · ')[0]} · {PASSPORT.limit.replace(' per payment', '')}
        </span>
        <span className="passport-row__sig">{PASSPORT.algorithm} ✓</span>
        <ChevronDown size={15} className="passport-row__chev" />
      </button>
      {open && (
        <div className="bcard__passport">
          <PassportCard compact />
        </div>
      )}

      <CheckBar
        passed={checksDone}
        label={checksDone === 6 ? 'Sent over FAST' : checksDone > 0 ? `Checking ${checksDone} / 6` : 'Ready for bank checks'}
      />
    </section>
  )
}
