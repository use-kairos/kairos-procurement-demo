import { OPS_AGENTS } from './agents-ops'
import { OFFICE_AGENTS } from './agents-office'

export type Row = [string, string]
export type Tone = 'ok' | 'wait' | 'warn' | 'ask'
export type AgentStatus = 'running' | 'waiting' | 'held' | 'needs-you'

export type InfoCard = {
  title: string
  figure: string
  figureLabel: string
  rows: Row[]
  status: string
  tone: Tone
  note?: string
}

// Kairos answers three questions about the other agent before any deal (from the Banking 2035 proposal):
// who is acting, under what authority, and is the transaction backed by real money?
export type Verdict = [ok: boolean, note: string]

// A conversation between our agent and another company's agent.
export type Handshake = {
  counterpart: { id: string; name: string; org: string; verified: boolean }
  verify: { who: Verdict; authority: Verdict; money: Verdict }
  lines: { who: 'us' | 'them'; text: string }[]
  outcome: string
  tone: Tone
}

export type Message =
  | { from: 'agent'; time?: string; text: string; bullets?: string[] }
  | { from: 'me'; time?: string; text: string }
  | { from: 'agent'; steps: { took: string; items: string[] } }
  | { from: 'agent'; card: 'payment' | InfoCard }
  | { from: 'agent'; a2a: Handshake }

export type Agent = {
  id: string
  name: string
  role: string
  color: string
  status: AgentStatus
  doing: string
  working: string
  since: string
  time: string
  unread: number
  passport: string
  request: { from: string; to: string; amount: string }
  messages: Message[]
}

export const STATUS_LABEL: Record<AgentStatus, string> = {
  running: 'Running',
  waiting: 'Waiting on bank',
  held: 'Held by bank',
  'needs-you': 'Needs you',
}

const byId = Object.fromEntries([...OPS_AGENTS, ...OFFICE_AGENTS].map((a) => [a.id, a]))

// Static for now; the scenarios will drive these.
export const AGENTS: Agent[] = ['pip', 'tessa', 'wren', 'otto', 'jules', 'sol'].map((id) => byId[id])
