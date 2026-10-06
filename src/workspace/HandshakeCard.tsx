import { ArrowLeftRight, ShieldAlert, ShieldCheck } from 'lucide-react'
import Avatar from './Avatar'
import type { Agent, Handshake } from './agents'
import './handshake.css'

// Our agent talking to another company's agent; the bank shows whether that agent carries a passport.
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
