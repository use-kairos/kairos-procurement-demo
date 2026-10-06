import { STATUS_LABEL, type Agent, type AgentStatus } from './agents'
import type { Run } from './useChecks'

export type Live = { status: AgentStatus; label: string }

// An agent's status right now, after any decision Alex made on the signing key.
export function liveStatus(agent: Agent, run?: Run): Live {
  if (run?.decision === 'approved') return { status: 'running', label: 'Running' }
  if (run?.decision === 'rejected') return { status: 'held', label: 'Stopped by Alex' }
  return { status: agent.status, label: STATUS_LABEL[agent.status] }
}

export type Filter = 'all' | 'needs-you' | 'running' | 'waiting' | 'held'

export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'needs-you', label: 'Needs you' },
  { id: 'running', label: 'Running' },
  { id: 'waiting', label: 'Waiting' },
  { id: 'held', label: 'Blocked' },
]
