import { useState } from 'react'
import { Check, ChevronDown, CreditCard, IdCard, X } from 'lucide-react'
import PassportCard, { PASSPORT } from '../passport/PassportCard'
import type { Decision } from './checks'
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

// The approved intent becomes card controls, so the card itself refuses anything else.
const TRIES: [string, boolean, string][] = [
  ['SGD 480 · Tan Supplies', true, 'Accepted'],
  ['SGD 510 · Tan Supplies', false, 'Declined · over limit'],
  ['SGD 480 · other merchant', false, 'Declined · merchant not allowed'],
]

function CardControls() {
  return (
    <div className="ccontrols">
      <div className="ccontrols__head">
        <span>Card ··2203 · single use · SGD 480 cap · Tan Supplies only</span>
        <span className="ccontrols__tag">Simulated · Airwallex Issuing planned</span>
      </div>
      <ul>
        {TRIES.map(([what, ok, result]) => (
          <li key={what} className={ok ? 'is-ok' : 'is-bad'}>
            {ok ? <Check size={13} /> : <X size={13} />}
            <span className="num">{what}</span>
            <span className="ccontrols__result">{result}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Inline plugin card: the payment the agent is about to make, with the passport it presents.
export default function BankCard({ checksDone, decision }: { checksDone: number; decision?: Decision }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="bcard">
      <CardHead title="Payment" />

      <div className="bcard__figure">
        <span className="bcard__amount num">SGD 480.00</span>
        <span className="bcard__rail">
          <CreditCard size={12} />
          Intent-bound card
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

      {decision === 'approved' && <CardControls />}

      <CheckBar
        passed={decision === 'approved' ? 6 : Math.min(checksDone, 5)}
        label={
          decision === 'approved'
            ? 'Paid · card closed'
            : decision === 'rejected'
              ? 'Rejected · nothing moved'
              : checksDone === 6
                ? "Waiting for Alex's key"
                : checksDone > 0
                  ? `Checking ${checksDone} / 6`
                  : 'Ready for Kairos checks'
        }
      />
    </section>
  )
}
