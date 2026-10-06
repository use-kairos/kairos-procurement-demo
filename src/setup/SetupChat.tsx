import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUp, Check, CheckCircle2, KeyRound, Mic, Plus, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import SignerOverlay from '../signer/SignerOverlay'
import { Code } from '../plugin/PluginPage'
import type { Decision } from '../workspace/checks'
import { ALSO, DETECT_STEPS, DETECTED, DOMAIN, DONE_STEPS, PAIRING, PROMPT, SCOPES } from './setupScript'
import '../workspace/thread.css'
import './setup.css'

type Props = { connected: boolean; onConnected: () => void }
type Auth = 'idle' | 'signing' | Decision

// Reveal order after Alex sends: detect steps one by one, then the framework, install and authorize cards.
const UNITS = DETECT_STEPS.length + 3
const STEP_MS = 750

function Me({ text }: { text: string }) {
  return (
    <div className="turn turn--me">
      <div className="bubble bubble--me">{text}</div>
    </div>
  )
}

function Assistant({ first, children }: { first?: boolean; children: React.ReactNode }) {
  return (
    <div className={`turn turn--agent${first ? ' is-first' : ''}`}>
      <div className="turn__avatar">{first && <span className="assistant-mark">C</span>}</div>
      <div className="turn__body">
        {first && (
          <div className="turn__meta">
            <strong>Cowork</strong>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

function StepList({ items }: { items: string[] }) {
  return (
    <ol className="steps__list setup-steps">
      {items.map((s) => (
        <li key={s}>
          <Check size={13} />
          {s}
        </li>
      ))}
    </ol>
  )
}

export default function SetupChat({ connected, onConnected }: Props) {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(connected ? PROMPT : '')
  const [shown, setShown] = useState(connected ? UNITS : 0)
  const [auth, setAuth] = useState<Auth>(connected ? 'approved' : 'idle')
  const scroll = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sent || shown >= UNITS) return
    const t = window.setTimeout(() => setShown((n) => n + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [sent, shown])

  useLayoutEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: 'smooth' })
  }, [shown, auth])

  const send = () => {
    if (!text.trim() || sent) return
    setSent(text.trim())
    setText('')
  }
  const decide = (d: Decision) => {
    setAuth(d)
    if (d === 'approved') onConnected()
  }
  const steps = Math.min(shown, DETECT_STEPS.length)
  const card = (i: number) => shown > DETECT_STEPS.length + i

  return (
    <div className="thread">
      <header className="topbar">
        <span className="assistant-mark assistant-mark--lg">C</span>
        <div className="topbar__who">
          <span className="topbar__name">Chat</span>
          <span className="topbar__role">Lim Ventures · no agents yet</span>
        </div>
      </header>

      <div className="thread__scroll" ref={scroll}>
        <div className="thread__col">
          <div className="thread__intro">
            <span className="assistant-mark assistant-mark--xl">C</span>
            <h2>Lim Ventures</h2>
            <p>A new company. No agents, no bank connected yet.</p>
          </div>

          {sent && <Me text={sent} />}

          {steps > 0 && (
            <Assistant first>
              <div className="setup-card">
                <span className="setup-card__label">Setting up {DOMAIN}</span>
                <StepList items={DETECT_STEPS.slice(0, steps)} />
              </div>
            </Assistant>
          )}

          {card(0) && (
            <Assistant>
              <div className="setup-card setup-detect">
                <img src={DETECTED.logo} alt="" />
                <div>
                  <span className="setup-card__label">Detected your agent</span>
                  <strong>{DETECTED.name}</strong>
                  <span className="setup-muted">{DETECTED.detail}</span>
                </div>
              </div>
              <div className="setup-also">
                Also works with
                {ALSO.map((p) => (
                  <img key={p.name} src={p.logo} alt={p.name} title={p.name} />
                ))}
                <span className="setup-chip">Codex</span>
              </div>
            </Assistant>
          )}

          {card(1) && (
            <Assistant>
              <div className="setup-card">
                <span className="setup-card__label">
                  <CheckCircle2 size={14} /> Kairos plugin v1.0 installed
                </span>
                <Code url={`https://${DOMAIN}/mcp`} passport={connected ? 'psp_ventures_v1_K9d3…' : 'waiting for your key'} />
              </div>
            </Assistant>
          )}

          {card(2) && (
            <Assistant>
              <div className="setup-card setup-auth">
                <span className="setup-auth__head">
                  <ShieldCheck size={16} /> Authorize Kairos
                </span>
                <ul>
                  {SCOPES.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="setup-muted">You confirm on your passport key: pairing code, then a quick identity check with its camera.</p>
                {auth === 'approved' ? (
                  <span className="setup-ok">
                    <CheckCircle2 size={15} /> Authorized on your passport key
                  </span>
                ) : (
                  <button className="btn-primary" disabled={auth === 'signing'} onClick={() => setAuth('signing')}>
                    <KeyRound size={15} /> Authorize on passport key
                  </button>
                )}
              </div>
            </Assistant>
          )}

          {auth === 'approved' && (
            <Assistant>
              <StepList items={DONE_STEPS} />
              <div className="bubble">
                Connected. Your first passport v1: read-only balances on Checking. Want me to create your first agent?
              </div>
            </Assistant>
          )}

          {auth === 'rejected' && (
            <Assistant>
              <div className="bubble">Setup paused. Nothing was connected.</div>
              <button className="btn-ghost setup-retry" onClick={() => setAuth('idle')}>
                <RotateCcw size={14} /> Try again
              </button>
            </Assistant>
          )}
        </div>
      </div>

      <div className="composer-wrap">
        {!sent && (
          <button className="setup-suggest" onClick={() => setText(PROMPT)}>
            <Sparkles size={14} /> {PROMPT}
          </button>
        )}
        <div className="composer">
          <button className="icon-btn" aria-label="Attach">
            <Plus size={18} />
          </button>
          <input
            className="composer__input"
            placeholder="Ask Cowork anything…"
            value={text}
            disabled={!!sent}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="icon-btn" aria-label="Voice">
            <Mic size={17} />
          </button>
          <button className="composer__send" aria-label="Send" disabled={!text.trim() || !!sent} onClick={send}>
            <ArrowUp size={17} />
          </button>
        </div>
        <p className="composer__note">Nothing touches your money until you sign on your passport key.</p>
      </div>

      {auth === 'signing' && <SignerOverlay device={PAIRING} onDecide={decide} onClose={() => setAuth('idle')} />}
    </div>
  )
}
