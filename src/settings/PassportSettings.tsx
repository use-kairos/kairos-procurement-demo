import { useState } from 'react'
import { ArrowLeft, CheckCircle2, KeyRound, Plus, RotateCcw, Trash2, XCircle } from 'lucide-react'
import Avatar from '../workspace/Avatar'
import type { Agent } from '../workspace/agents'
import MultiSelect from './MultiSelect'
import SignerOverlay from '../signer/SignerOverlay'
import type { Decision } from '../workspace/checks'
import { changedSections, diffLines, ruleState } from './diff'
import { ACCOUNTS, PERIODS, RESOURCES, newRule, summarize, type Payees, type Policy, type Rule } from './permissions'
import './settings.css'

type Props = { agent: Agent; policy: Policy; onSave: (p: Policy) => void; onBack: () => void }

const PAYEES: { id: Payees; title: string; desc: string }[] = [
  { id: 'known', title: 'Known payees', desc: 'Only people Alex has paid before' },
  { id: 'verified', title: 'Verified businesses', desc: 'Any business whose agent has a passport' },
  { id: 'any', title: 'Anyone', desc: 'Not recommended' },
]

function Edited({ on }: { on: boolean }) {
  return on ? <span className="edited-tag">Edited</span> : null
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button type="button" className={`switch${on ? ' is-on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on}>
        <span />
      </button>
    </label>
  )
}

// Per-agent passport editor, laid out like a scoped API-token form.
export default function PassportSettings({ agent, policy, onSave, onBack }: Props) {
  const [p, setP] = useState(policy)
  const [outcome, setOutcome] = useState<Decision | null>(null)
  const [signing, setSigning] = useState(false)
  const set = (patch: Partial<Policy>) => {
    setOutcome(null)
    setP((cur) => ({ ...cur, ...patch }))
  }
  const setRule = (id: number, patch: Partial<Rule>) => set({ rules: p.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) })

  // `policy` is the last signed passport; the form is a draft until Alex signs it on the key.
  const changes = diffLines(policy, p)
  const dirty = changes.length > 0
  const edited = changedSections(policy, p)

  const decide = (d: Decision) => {
    setSigning(false)
    setOutcome(d)
    if (d !== 'approved') return
    const next = { ...p, version: p.version + 1 }
    setP(next)
    onSave(next)
  }

  return (
    <div className="settings">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={17} />
        </button>
        <div className="topbar__who">
          <span className="topbar__name">Passport settings</span>
          <span className="topbar__role">{agent.name}</span>
        </div>
        <span className="settings__version">
          v{p.version} · ML-DSA-65
        </span>
      </header>

      <div className="settings__scroll">
        <div className="settings__col">
          <div className="settings__intro">
            <Avatar id={agent.id} color={agent.color} size={48} />
            <div>
              <h2>{agent.name}'s passport</h2>
              <p>What {agent.name} may do through Certainty Bank. Every change is signed with your key.</p>
            </div>
          </div>

          <section className="s-card">
            <div className="s-card__head">
              <h3>
                Permissions <Edited on={edited.rules} />
              </h3>
              <p>Choose what {agent.name} can read or act on, which accounts, and how much.</p>
            </div>
            <div className="perm-grid perm-grid--head">
              <span>Resource</span>
              <span>Accounts</span>
              <span>Access</span>
              <span>Limit (SGD)</span>
              <span />
            </div>
            {p.rules.map((r) => (
              <div key={r.id} className={`perm-grid${ruleState(policy, r) ? ' is-edited' : ''}`}>
                <select className="field" value={r.resource} onChange={(e) => setRule(r.id, { resource: e.target.value as Rule['resource'] })}>
                  {RESOURCES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <MultiSelect options={ACCOUNTS} value={r.accounts} onChange={(accounts) => setRule(r.id, { accounts })} />
                <div className="seg">
                  {(['Read', 'Edit'] as const).map((a) => (
                    <button type="button" key={a} className={r.access === a ? 'is-on' : ''} onClick={() => setRule(r.id, { access: a })}>
                      {a}
                    </button>
                  ))}
                </div>
                <div className={`limit${r.access === 'Read' ? ' is-disabled' : ''}`}>
                  <input
                    className="field num"
                    type="number"
                    min={0}
                    step={100}
                    disabled={r.access === 'Read'}
                    value={r.access === 'Read' ? '' : (r.limit ?? '')}
                    placeholder={r.access === 'Read' ? '—' : 'No limit'}
                    onChange={(e) => setRule(r.id, { limit: e.target.value ? Number(e.target.value) : null })}
                  />
                  <select className="field" disabled={r.access === 'Read'} value={r.period} onChange={(e) => setRule(r.id, { period: e.target.value as Rule['period'] })}>
                    {PERIODS.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>
                <button type="button" className="icon-btn" aria-label="Remove" onClick={() => set({ rules: p.rules.filter((x) => x.id !== r.id) })}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button type="button" className="add-row" onClick={() => set({ rules: [...p.rules, newRule()] })}>
              <Plus size={14} /> Add more
            </button>
          </section>

          <section className="s-card">
            <div className="s-card__head">
              <h3>
                Who {agent.name} can pay <Edited on={edited.payees} />
              </h3>
            </div>
            <div className="radio-cards">
              {PAYEES.map((o) => (
                <button type="button" key={o.id} className={`radio-card${p.payees === o.id ? ' is-on' : ''}`} onClick={() => set({ payees: o.id })}>
                  <span className="radio-card__dot" />
                  <span className="radio-card__title">{o.title}</span>
                  <span className="radio-card__desc">{o.desc}</span>
                </button>
              ))}
            </div>
            <Toggle on={p.passportOnly} onChange={(v) => set({ passportOnly: v })} label="Only deal with other agents that show a passport" />
          </section>

          <section className="s-card">
            <div className="s-card__head">
              <h3>
                Ask me on my signing key <Edited on={edited.stepUp} />
              </h3>
              <p>{agent.name} stops and waits for you to press OK.</p>
            </div>
            <label className="toggle-row">
              <span>When an amount is above</span>
              <input className="field num field--sm" type="number" min={0} step={100} value={p.stepUpAbove} onChange={(e) => set({ stepUpAbove: Number(e.target.value) })} />
            </label>
            <Toggle on={p.stepUpNewPayee} onChange={(v) => set({ stepUpNewPayee: v })} label="For a payee it has never paid" />
            <Toggle on={p.stepUpOffHours} onChange={(v) => set({ stepUpOffHours: v })} label={`Outside active hours (${p.hours[0]}–${p.hours[1]})`} />
          </section>

          <section className="s-card">
            <div className="s-card__head">
              <h3>
                Validity <Edited on={edited.validity} />
              </h3>
            </div>
            <div className="validity">
              <label>
                Active from
                <input className="field" type="time" value={p.hours[0]} onChange={(e) => set({ hours: [e.target.value, p.hours[1]] })} />
              </label>
              <label>
                to
                <input className="field" type="time" value={p.hours[1]} onChange={(e) => set({ hours: [p.hours[0], e.target.value] })} />
              </label>
              <label>
                Expires on
                <input className="field" type="date" value={p.validUntil} onChange={(e) => set({ validUntil: e.target.value })} />
              </label>
            </div>
          </section>

          <section className="s-card s-card--summary">
            <div className="s-card__head">
              <h3>Summary</h3>
            </div>
            {dirty && (
              <div className="changes">
                <span className="changes__title">
                  {changes.length} change{changes.length > 1 ? 's' : ''} to sign · v{policy.version} → v{policy.version + 1}
                </span>
                <ul>
                  {changes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="summary">
              {summarize(agent.name, p).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer className="settings__foot">
        {outcome === 'approved' && !dirty ? (
          <span className="settings__signed">
            <CheckCircle2 size={15} /> Passport v{p.version} signed on your key and sent to Certainty Bank
          </span>
        ) : outcome === 'rejected' ? (
          <span className="settings__rejected">
            <XCircle size={15} /> Not signed · your changes are kept
          </span>
        ) : dirty ? (
          <span className="settings__hint settings__hint--dirty">
            {changes.length} change{changes.length > 1 ? 's' : ''} · sign on your key to apply
          </span>
        ) : (
          <span className="settings__hint">No changes to sign</span>
        )}
        {dirty && (
          <button className="btn-ghost" onClick={() => set(policy)}>
            <RotateCcw size={14} /> Discard
          </button>
        )}
        <button className="btn-ghost" onClick={onBack}>
          Cancel
        </button>
        <button className="btn-primary" disabled={!dirty} onClick={() => setSigning(true)}>
          <KeyRound size={15} /> Sign & update passport
        </button>
      </footer>
      {signing && (
        <SignerOverlay
          device={{
            title: 'Update passport',
            who: `${agent.name} · v${policy.version} → v${policy.version + 1}`,
            amount: `${changes.length} change${changes.length > 1 ? 's' : ''}`,
            detail: changes[0].length > 40 ? changes[0].slice(0, 39) + '…' : changes[0],
            note: 'New passport · signed ML-DSA-65',
          }}
          onDecide={decide}
          onClose={() => setSigning(false)}
        />
      )}
    </div>
  )
}
