import { useCallback, useEffect, useRef, useState } from 'react'
import { OUTCOMES, chain, resolved, seedLog, type Decision, type LogEntry } from './checks'

export type Run = { done: number; running: boolean; decision?: Decision }

const STEP_MS = 650
const OPEN_SIGNER_MS = 700
const now = () => new Date().toTimeString().slice(0, 5)

// Plays the six checks one at a time. If a step needs Alex, it pauses and asks for the signing key;
// after OK or ✕ the remaining steps play out. Every outcome is appended to the signed audit log.
export function useChecks() {
  const [runs, setRuns] = useState<Record<string, Run>>({})
  const [log, setLog] = useState<LogEntry[]>(seedLog)
  const [signer, setSigner] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
  const note = useCallback((text: string, tone: LogEntry['tone']) => {
    setLog((l) => [...l, chain(l[l.length - 1], l[l.length - 1].id + 1, now(), text, tone)])
  }, [])

  // Reveal steps from..to (1-based count of finished steps), then call onEnd.
  const play = (id: string, decision: Decision | undefined, from: number, to: number, onEnd: () => void) => {
    for (let step = from; step <= to; step++) {
      later((step - from + 1) * STEP_MS, () => {
        setRuns((r) => ({ ...r, [id]: { done: step, running: step < to, decision } }))
        if (step === to) onEnd()
      })
    }
  }

  const run = useCallback(
    (id: string) => {
      const o = OUTCOMES[id]
      setSigner(null)
      setRuns((r) => ({ ...r, [id]: { done: 0, running: true } }))
      play(id, undefined, 1, o.results.length, () => {
        note(o.log, o.tone)
        if (o.approve) later(OPEN_SIGNER_MS, () => setSigner(id))
      })
    },
    [note],
  )

  const decide = useCallback(
    (id: string, decision: Decision) => {
      const o = OUTCOMES[id]
      const r = resolved(o, decision)
      setSigner(null)
      // The paused step flips immediately; any remaining steps play out after it.
      setRuns((all) => ({ ...all, [id]: { done: r.askAt + 1, running: r.results.length > r.askAt + 1, decision } }))
      const finish = () => note(decision === 'approved' ? o.approve!.log : `${id[0].toUpperCase() + id.slice(1)} · rejected by Alex on signing key`, r.tone)
      if (r.results.length > r.askAt + 1) play(id, decision, r.askAt + 2, r.results.length, finish)
      else finish()
    },
    [note],
  )

  return { runs, log, run, note, signer, openSigner: setSigner, decide }
}
