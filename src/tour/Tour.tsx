import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react'
import { TOUR } from './tourSteps'
import './tour.css'

const SEEN_KEY = 'kairos-tour-seen'

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Private mode: the guide simply shows again next time.
  }
}

// A small coach card that walks judges through intent → plan → approval → action → proof.
export default function Tour() {
  const [open, setOpen] = useState(() => !readSeen())
  const [i, setI] = useState(0)
  const step = TOUR[i]

  useEffect(() => {
    if (!open) return
    const el = document.querySelector(step.target)
    if (!el) return
    el.classList.add('tour-focus')
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    return () => el.classList.remove('tour-focus')
  }, [open, step])

  const close = () => {
    setOpen(false)
    markSeen()
  }

  if (!open)
    return (
      <button className="tour-reopen" onClick={() => (setI(0), setOpen(true))}>
        <Compass size={14} /> Guide
      </button>
    )

  return (
    <aside className="tour" role="dialog" aria-label="Demo guide">
      <ol className="tour__stages">
        {TOUR.map((s, n) => (
          <li key={s.stage} className={n === i ? 'is-on' : n < i ? 'is-done' : ''}>
            <button onClick={() => setI(n)}>{s.stage}</button>
          </li>
        ))}
      </ol>
      <h2 className="tour__title">{step.title}</h2>
      <p className="tour__text">{step.text}</p>
      <footer className="tour__foot">
        <span className="tour__count num">
          {i + 1} / {TOUR.length} · concept demo, simulated
        </span>
        <button className="tour__btn" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Back">
          <ArrowLeft size={14} />
        </button>
        {i < TOUR.length - 1 ? (
          <button className="tour__btn tour__btn--primary" onClick={() => setI(i + 1)}>
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button className="tour__btn tour__btn--primary" onClick={close}>
            Explore
          </button>
        )}
      </footer>
      <button className="tour__close icon-btn" onClick={close} aria-label="Close guide">
        <X size={15} />
      </button>
    </aside>
  )
}
