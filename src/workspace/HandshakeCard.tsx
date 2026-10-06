import { ArrowLeftRight, Check, ShieldAlert, ShieldCheck, X } from 'lucide-react'
import Avatar from './Avatar'
import type { Agent, Handshake } from './agents'
import './handshake.css'

const QUESTIONS = [
  ['who', 'Who is acting'],
  ['authority', 'Under what authority'],
  ['money', 'Backed by real money'],
] as const

// Our agent talking to another company's agent; Kairos shows whether that agent carries a passport.
type Props = { agent: Agent; h: Handshake; visibleLines?: number }

export default function HandshakeCard({ agent, h, visibleLines }: Props) {
  const them = h.counterpart
  const n = visibleLines ?? h.lines.length
  const done = n >= h.lines.length
  return (
    <section className={`hs hs--${h.tone}`}>
      <header className="hs__head">
        <span className="hs__pair">
          <Avatar id={agent.id} color={agent.color} size={28} />
          <Avatar id={them.id} size={28} />
        </span>
        <span className="hs__who">
          <span className="hs__names">
            {agent.name}
            <ArrowLeftRight size={12} />
            {them.name}
          </span>
          <span className="hs__org">{them.org}</span>
        </span>
        <span className={`hs__badge${them.verified ? '' : ' is-bad'}`}>
          {them.verified ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
          {them.verified ? 'Passport verified' : 'No passport'}
        </span>
      </header>

      <ul className="hs__verify" aria-label="Checked by Kairos before any deal">
        {QUESTIONS.map(([key, label]) => {
          const [ok, note] = h.verify[key]
          return (
            <li key={key} className={ok ? 'is-ok' : 'is-bad'}>
              <span className="hs__verify-q">
                {ok ? <Check size={12} /> : <X size={12} />}
                {label}
              </span>
              <span className="hs__verify-a">{note}</span>
            </li>
          )
        })}
      </ul>

      <ol className="hs__lines">
        {h.lines.slice(0, n).map((l, i) => (
          <li key={i} className={`hs__line hs__line--${l.who}`}>
            {l.who === 'them' && <Avatar id={them.id} size={20} />}
            <span className="hs__bubble">{l.text}</span>
          </li>
        ))}
      </ol>

      {done && (
        <footer className="hs__foot">
          <span className="hs__dot" />
          {h.outcome}
        </footer>
      )}
    </section>
  )
}
