import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowUp, Check, ChevronDown, Copy, IdCard, Mic, PanelRight, Play, Plus, Reply, SmilePlus, Square } from 'lucide-react'
import Avatar from './Avatar'
import BankCard from './BankCard'
import InfoCard from './InfoCard'
import HandshakeCard from './HandshakeCard'
import { type Agent, type InfoCard as Card, type Message } from './agents'
import type { Decision } from './checks'
import { liveStatus } from './status'
import './thread.css'

type Props = { agent: Agent; checksDone: number; decision?: Decision; bankOpen: boolean; onToggleBank: () => void; onOpenSettings: () => void }

function Actions() {
  return (
    <div className="msg-actions" aria-hidden>
      <SmilePlus size={15} />
      <Reply size={15} />
      <Copy size={14} />
    </div>
  )
}

function Steps({ took, items }: { took: string; items: string[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="steps">
      <button className="steps__toggle" onClick={() => setOpen((v) => !v)}>
        Worked for {took}
        <ChevronDown size={14} className={open ? 'is-open' : ''} />
      </button>
      {open && (
        <ol className="steps__list">
          {items.map((s) => (
            <li key={s}>
              <Check size={13} />
              {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// Once Alex decides on the signing key, cards that were waiting for Alex show the result.
function settle(card: Card, decision?: Decision): Card {
  if (card.tone !== 'ask' || !decision) return card
  return decision === 'approved'
    ? { ...card, status: 'Signed by Alex', tone: 'ok', note: undefined }
    : { ...card, status: 'Rejected by Alex', tone: 'warn', note: undefined }
}

type BodyProps = { m: Message; agent: Agent; checksDone: number; decision?: Decision; lines?: number }

function Body({ m, agent, checksDone, decision, lines }: BodyProps) {
  if ('steps' in m) return <Steps {...m.steps} />
  if ('a2a' in m) return <HandshakeCard agent={agent} h={m.a2a} visibleLines={lines} />
  if ('card' in m) return m.card === 'payment' ? <BankCard checksDone={checksDone} /> : <InfoCard card={settle(m.card, decision)} />
  return (
    <div className={`bubble${m.from === 'me' ? ' bubble--me' : ''}`}>
      {m.text}
      {'bullets' in m && m.bullets && (
        <ul>
          {m.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AgentThread({ agent, checksDone, decision, bankOpen, onToggleBank, onOpenSettings }: Props) {
  const live = liveStatus(agent, decision ? { done: 0, running: false, decision } : undefined)
  const working = decision === 'approved' ? 'wrapping up' : decision === 'rejected' ? 'standing down' : agent.working
  const scroll = useRef<HTMLDivElement>(null)

  // Replay: every message is one step; agent-to-agent chats reveal one line per step.
  const steps = useMemo(() => agent.messages.map((m) => ('a2a' in m ? m.a2a.lines.length : 1)), [agent])
  const total = steps.reduce((a, b) => a + b, 0)
  const [shown, setShown] = useState(total)
  const playing = shown < total

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 400 : 850)
    return () => clearTimeout(t)
  }, [shown, playing])

  // Open at the latest message, and follow along during a replay.
  useLayoutEffect(() => {
    const el = scroll.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: playing ? 'smooth' : 'auto' })
  }, [shown, playing])

  // How much of message i is visible: 0 = hidden, otherwise number of steps shown.
  const visible = (i: number) => {
    const before = steps.slice(0, i).reduce((a, b) => a + b, 0)
    return Math.max(0, Math.min(steps[i], shown - before))
  }

  return (
    <div className="thread">
      <header className="topbar">
        <Avatar id={agent.id} color={agent.color} size={30} />
        <div className="topbar__who">
          <span className="topbar__name">{agent.name}</span>
          <span className="topbar__role">{agent.role} agent</span>
        </div>
        <span className={`status-pill status-pill--${live.status}`}>
          <span className="status-pill__dot" />
          {live.label}
        </span>
        <div className="topbar__right">
          <button
            className={`replay-btn${playing ? ' is-on' : ''}`}
            onClick={() => setShown(playing ? total : 0)}
            title="Replay this conversation"
          >
            {playing ? <Square size={12} /> : <Play size={13} />}
            {playing ? 'Stop' : 'Replay'}
          </button>
          <button className="passport-chip" title="Edit passport permissions" aria-label="Passport settings" onClick={onOpenSettings}>
            <IdCard size={14} />
            {agent.passport}
          </button>
          <button
            className={`icon-btn${bankOpen ? ' is-on' : ''}`}
            onClick={onToggleBank}
            aria-label="Toggle bank's view"
            title="Bank's view"
          >
            <PanelRight size={16} />
          </button>
        </div>
      </header>

      <div className="thread__scroll" ref={scroll}>
        <div className="thread__col">
          <div className="thread__intro">
            <Avatar id={agent.id} color={agent.color} size={76} />
            <h2>{agent.name}</h2>
            <p>
              {agent.role} agent for Lim Bakery · working since {agent.since}
            </p>
          </div>

          <div className="day-sep">
            <span>Today</span>
          </div>

          {agent.messages.map((m, i) => {
            if (!visible(i)) return null
            const prev = agent.messages[i - 1]
            const first = !prev || prev.from !== m.from
            if (m.from === 'me') {
              return (
                <div key={i} className="turn turn--me">
                  <Body m={m} agent={agent} checksDone={checksDone} decision={decision} lines={visible(i)} />
                  {m.time && <span className="turn__time">{m.time}</span>}
                </div>
              )
            }
            const isText = 'text' in m
            return (
              <div key={i} className={`turn turn--agent${first ? ' is-first' : ''}`}>
                <div className="turn__avatar">{first && <Avatar id={agent.id} color={agent.color} size={28} />}</div>
                <div className="turn__body">
                  {first && (
                    <div className="turn__meta">
                      <strong>{agent.name}</strong>
                      {'time' in m && m.time && <span>{m.time}</span>}
                    </div>
                  )}
                  <Body m={m} agent={agent} checksDone={checksDone} decision={decision} lines={visible(i)} />
                  {isText && <Actions />}
                </div>
              </div>
            )
          })}

          <div className="turn turn--agent is-first">
            <div className="turn__avatar">
              <Avatar id={agent.id} color={agent.color} size={28} />
            </div>
            <div className="typing">
              <span className="typing__dots">
                <i />
                <i />
                <i />
              </span>
              {agent.name} is {playing ? 'typing' : working}…
            </div>
          </div>
        </div>
      </div>

      <div className="composer-wrap">
        <div className="composer">
          <button className="icon-btn" aria-label="Attach">
            <Plus size={18} />
          </button>
          <input className="composer__input" placeholder={`Message ${agent.name}…`} disabled />
          <button className="icon-btn" aria-label="Voice">
            <Mic size={17} />
          </button>
          <button className="composer__send" aria-label="Send" disabled>
            <ArrowUp size={17} />
          </button>
        </div>
        <p className="composer__note">
          {agent.name} acts within its passport. Anything outside needs your signing key.
        </p>
      </div>
    </div>
  )
}
