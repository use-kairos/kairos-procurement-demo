import type { Tone } from './agents'

export const CHECKS: [string, string][] = [
  ['Known agent', 'Registered with the passport office'],
  ['Passport valid', 'Signature and expiry verified'],
  ['Identity', 'Signing key bound to Alex'],
  ['Inside mandate', 'Amount, payee and time within limits'],
  ['AML / sanctions', 'Monitoring and screening'],
  ['Payment rail', 'Card or transfer moves the money'],
]

export type CheckState = 'pass' | 'ask' | 'wait' | 'fail'
export type CheckResult = { state: CheckState; note: string }
// What the signing key shows, and what happens after Alex presses OK.
export type Approval = {
  device: { title: string; who: string; amount: string; detail: string; note?: string; faceCheck?: boolean }
  results: CheckResult[] // replace the 'ask' step onward
  banner: string
  log: string
}

export type Outcome = {
  results: CheckResult[] // fewer than 6 means the run stops there
  banner: string
  log: string
  tone: Tone
  approve?: Approval
}

export type Decision = 'approved' | 'rejected'

const pass = (note: string): CheckResult => ({ state: 'pass', note })
const basics = (name: string) => [
  pass(`${name} · registered agent`),
  pass('ML-DSA-65 signature valid · not expired'),
  pass("Bound to Alex's signing key"),
]

// What the bank decides for each agent's current request.
export const OUTCOMES: Record<string, Outcome> = {
  pip: {
    results: [
      ...basics('Pip'),
      pass('SGD 480 ≤ 1,000 · Tan Supplies is a known payee'),
      pass('No sanctions hits · no mule signals'),
      { state: 'ask', note: 'Single-use card ready · Alex confirms on the signing key' },
    ],
    banner: 'Card ready. Alex confirms the payment on the signing key.',
    log: 'Pip · SGD 480 card waiting for Alex',
    tone: 'ask',
    approve: {
      device: { title: 'Sign payment', who: 'Pip · Procurement agent', amount: 'SGD 480.00', detail: 'Tan Supplies · single-use card' },
      results: [pass('Confirmed on Alex\'s key · card ··2203 · Tan Supplies only · SGD 480 cap')],
      banner: 'Card issued and charged. All 6 checks passed.',
      log: 'Pip → Tan Supplies · SGD 480 paid · card ··2203 closed · confirmed by Alex on signing key',
    },
  },
  tessa: {
    results: [
      ...basics('Tessa'),
      pass('May request credit · cannot accept'),
      pass('Sales data consistent · no flags'),
      { state: 'ask', note: 'Offer in: SGD 20,000 · 90 days · 4.2% p.a.' },
    ],
    banner: 'Offer is in. Only Alex can accept it, on the signing key.',
    log: 'Tessa · loan offer SGD 20,000 waiting for Alex',
    tone: 'ask',
    approve: {
      device: { title: 'Accept loan offer', who: 'Tessa · Treasury agent', amount: 'SGD 20,000', detail: '90 days · 4.2% p.a.' },
      results: [pass('Accepted by Alex · SGD 20,000 credited to Checking')],
      banner: 'Loan accepted. SGD 20,000 is in Checking.',
      log: 'Tessa · loan SGD 20,000 accepted by Alex on signing key',
    },
  },
  wren: {
    results: [...basics('Wren'), { state: 'ask', note: "Investing is outside Wren's passport" }],
    banner: 'Paused. Alex must press OK on the signing key.',
    log: 'Wren · SGD 15,000 investment paused for Alex',
    tone: 'ask',
    approve: {
      device: { title: 'Approve investment', who: 'Wren · Wealth agent', amount: 'SGD 15,000', detail: 'T-bill 10,000 · fund 5,000' },
      results: [
        pass('Approved by Alex on the signing key'),
        pass('Government T-bill and money-market fund · no flags'),
        pass('Settled · T-bill SGD 10,000 + fund SGD 5,000'),
      ],
      banner: 'Approved. The GST reserve is invested until January.',
      log: 'Wren · SGD 15,000 invested · approved by Alex on signing key',
    },
  },
  otto: {
    results: [...basics('Otto'), { state: 'ask', note: "Filing needs the director's declaration" }],
    banner: 'Paused. Alex must declare on the signing key.',
    log: 'Otto · GST F5 waiting for Alex to declare',
    tone: 'ask',
    approve: {
      device: { title: 'Declare GST F5', who: 'Otto · CFO agent', amount: 'SGD 6,120', detail: 'Q3 · paid from GST reserve' },
      results: [
        pass('Declared by Alex on the signing key'),
        pass('Filing and payment consistent · no flags'),
        pass('Filed · SGD 6,120 paid over FAST'),
      ],
      banner: 'Filed. GST return declared and paid.',
      log: 'Otto · GST F5 filed · declared by Alex on signing key',
    },
  },
  jules: {
    results: [
      ...basics('Jules'),
      pass('SGD 2,480 ≤ 3,000 travel limit'),
      pass('Merlion Air · verified merchant'),
      pass('Paid with single-use card token ··4417'),
    ],
    banner: 'Paid. All 6 checks passed.',
    log: 'Jules → Merlion Air · SGD 2,480 paid',
    tone: 'ok',
  },
  sol: {
    results: [
      ...basics('Sol'),
      { state: 'fail', note: 'Refunds only to the original account' },
      { state: 'fail', note: '5 accounts share one device · mule ring' },
    ],
    banner: 'Blocked. The refund stays on hold.',
    log: 'Sol · refund SGD 260 blocked · mule ring',
    tone: 'warn',
  },
}

const askIndex = (o: Outcome) => o.results.findIndex((r) => r.state === 'ask')

// The checks, banner and log line once Alex has (or hasn't) decided on the signing key.
export function resolved(o: Outcome, decision?: Decision) {
  const i = askIndex(o)
  if (!decision || i < 0 || !o.approve) return { results: o.results, banner: o.banner, tone: o.tone, askAt: i }
  if (decision === 'approved')
    return { results: [...o.results.slice(0, i), ...o.approve.results], banner: o.approve.banner, tone: 'ok' as Tone, askAt: i }
  return {
    results: [...o.results.slice(0, i), { state: 'fail' as CheckState, note: 'Rejected by Alex on the signing key' }],
    banner: 'Rejected by Alex. Nothing moved.',
    tone: 'warn' as Tone,
    askAt: i,
  }
}

// What kind of event a log line records, shown as a small tag.
export function logKind(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('rejected')) return 'Rejected'
  if (t.includes('approved') || t.includes('declared') || t.includes('accepted')) return 'Approval'
  if (t.includes('passport')) return 'Passport'
  if (t.includes('card token')) return 'Card'
  if (t.includes('sweep')) return 'Sweep'
  if (t.includes('refund')) return 'Refund'
  if (t.includes('loan') || t.includes('credit')) return 'Credit'
  if (t.includes('invest')) return 'Investment'
  if (t.includes('gst')) return 'Tax'
  return 'Payment'
}

export type LogEntry = { id: number; time: string; text: string; tone: Tone; hash: string; prev: string }

// Tiny FNV-1a so each entry's hash depends on the previous one, like a real chain.
function fnv(input: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export function chain(prev: LogEntry | undefined, id: number, time: string, text: string, tone: Tone): LogEntry {
  const prevHash = prev?.hash ?? '00000000'
  const hash = fnv(prevHash + id + time + text) + fnv(text + prevHash)
  return { id, time, text, tone, hash, prev: prevHash }
}

// Earlier today, so the log already reads as a running system.
export function seedLog(): LogEntry[] {
  const seed: [string, string, Tone][] = [
    ['06:05', 'Wren · overnight sweep returned SGD 38,400', 'ok'],
    ['08:12', "Pip · passport renewed · ≤ SGD 1,000", 'ok'],
    ['08:40', 'Jules · single-use card token issued', 'ok'],
  ]
  const log: LogEntry[] = []
  seed.forEach(([time, text, tone], i) => log.push(chain(log[i - 1], 409 + i, time, text, tone)))
  return log
}
