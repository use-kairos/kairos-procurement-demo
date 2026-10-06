import { ArrowRight, Check, KeyRound, Link2, Loader2, Play, RotateCcw, ShieldCheck, Clock, X } from 'lucide-react'
import { AGENTS, type Agent } from './agents'
import Avatar from './Avatar'
import { CHECKS, OUTCOMES, logKind, resolved, type CheckState, type LogEntry } from './checks'
import type { Run } from './useChecks'
import './bankview.css'

const STATE_LABEL: Record<CheckState | 'pending' | 'checking', string> = {
  pending: 'Pending',
  checking: 'Checking…',
  pass: 'Passed',
  ask: 'Needs Alex',
  wait: 'Waiting',
  fail: 'Blocked',
}

function StateIcon({ state, n }: { state: CheckState | 'pending' | 'checking'; n: number }) {
  if (state === 'checking') return <Loader2 size={13} className="spin" />
  if (state === 'pass') return <Check size={13} />
  if (state === 'fail') return <X size={13} />
  if (state === 'ask') return <KeyRound size={12} />
  if (state === 'wait') return <Clock size={12} />
  return <>{n}</>
}

type Props = { agent: Agent; run?: Run; log: LogEntry[]; onRun: () => void; onOpenSigner: () => void; onOpenPassport: () => void }

export default function BankView({ agent, run, log, onRun, onOpenSigner, onOpenPassport }: Props) {
  const outcome = resolved(OUTCOMES[agent.id], run?.decision)
  const awaitingAlex = !!run && !run.running && !run.decision && outcome.tone === 'ask'
  const done = run?.done ?? 0
  const finished = !!run && !run.running
  const passed = outcome.results.slice(0, done).filter((r) => r.state === 'pass').length

  return (
    <aside className="panel bank-view">
      <header className="bv-head">
        <button className="bank-mark bank-mark--lg bv-passport-btn" onClick={onOpenPassport} title={`View ${agent.name}'s passport`}>
          <ShieldCheck size={15} />
        </button>
        <div className="bv-head__text">
          <span className="bv-head__title">Kairos view</span>
          <span className="bv-head__sub">Kairos · checks before money moves</span>
        </div>
        <span className="bv-live">
          <span />
          Live
        </span>
      </header>

      <div className="bv-body">
        <section className="bv-request">
          <div className="bv-label">Incoming request</div>
          <div className="bv-request__amount num">{agent.request.amount}</div>
          <div className="bv-request__route">
            <strong>{agent.request.from}</strong>
            <ArrowRight size={13} />
            <span>{agent.request.to}</span>
          </div>
        </section>

        <section>
          <div className="bv-label">
            <span>
              Checks <span className="bv-label__count">{passed} / 6</span>
            </span>
            <button className="bv-run" onClick={onRun} disabled={run?.running}>
              {run?.running ? <Loader2 size={13} className="spin" /> : finished ? <RotateCcw size={13} /> : <Play size={13} />}
              {run?.running ? 'Checking' : finished ? 'Replay' : 'Run checks'}
            </button>
          </div>
          <ol className="bv-checks" onClick={() => !run?.running && onRun()}>
            {CHECKS.map(([name, desc], i) => {
              const result = i < done ? outcome.results[i] : undefined
              const state = result?.state ?? (run?.running && i === done ? 'checking' : 'pending')
              return (
                <li key={name} className={`bv-check is-${state}`}>
                  <span className="bv-check__num">
                    <StateIcon state={state} n={i + 1} />
                  </span>
                  <div className="bv-check__text">
                    <div className="bv-check__name">{name}</div>
                    <div className="bv-check__desc">{result?.note ?? desc}</div>
                  </div>
                  <span className="bv-check__state">{STATE_LABEL[state]}</span>
                </li>
              )
            })}
          </ol>
          {finished && (
            <div className={`bv-banner bv-banner--${outcome.tone}`}>
              {outcome.banner}
              {awaitingAlex && (
                <button className="bv-banner__btn" onClick={onOpenSigner}>
                  <KeyRound size={13} /> Pick up signing key
                </button>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="bv-label">
            <span>Audit log</span>
            <span className="bv-chain">
              <Link2 size={12} /> {log.length} entries · chain intact
            </span>
          </div>
          <p className="bv-explain">
            A receipt for every decision. Each one is signed and linked to the one before, so no one can quietly
            change history.
          </p>
          <ol className="bv-trail">
            {[...log].reverse().map((e, i, all) => {
              const [who, ...rest] = e.text.split(' · ')
              const byAlex = /by Alex/.test(e.text)
              const prev = all[i + 1]
              const actor = AGENTS.find((a) => a.name === who)
              return (
                <li key={e.id} className={`bv-entry bv-entry--${e.tone}`} title={`hash ${e.hash} · previous ${e.prev}`}>
                  <span className="bv-entry__avatar">
                    {actor && <Avatar id={actor.id} color={actor.color} size={28} />}
                    <span className="bv-entry__dot" />
                  </span>
                  <div className="bv-entry__body">
                    <div className="bv-entry__top">
                      <strong>{who}</strong>
                      <span className={`bv-kind bv-kind--${e.tone}`}>{logKind(e.text)}</span>
                      <span className="bv-entry__time">{e.time}</span>
                    </div>
                    <div className="bv-entry__text">{rest.join(' · ')}</div>
                    <div className="bv-entry__meta">
                      {byAlex ? <KeyRound size={11} /> : <ShieldCheck size={11} />}
                      Signed by {byAlex ? "Alex's key" : 'Kairos'}
                      <span className="bv-entry__sep">·</span>#{String(e.id).padStart(4, '0')}
                      {prev ? ` links to #${String(prev.id).padStart(4, '0')}` : ' first today'}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      </div>

      <footer className="bv-foot">Concept demo · checks, signatures (ML-DSA-65 planned) and payments are simulated</footer>
    </aside>
  )
}
