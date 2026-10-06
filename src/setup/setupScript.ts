import { PLATFORMS } from '../plugin/platforms'
import type { Approval } from '../workspace/checks'

// Scripted onboarding for Lim Ventures: install the Kairos plugin from a chat.
export const DOMAIN = 'hikairos.app'
export const PROMPT = `Install ${DOMAIN} and set up the plugin for me.`

export const DETECTED = { name: 'Claude Code', logo: '/logos/claude.svg', detail: 'MCP plugins supported · running on this Mac' }
export const ALSO = PLATFORMS.filter((p) => ['ChatGPT', 'Gemini', 'Manus', 'OpenClaw', 'Hermes Agent'].includes(p.name))

export const DETECT_STEPS = [
  'Checked your agent framework',
  `Fetched ${DOMAIN}/.well-known/mcp.json`,
  'Publisher verified: Kairos · signed ML-DSA-65',
  'Installed Kairos plugin v1.0',
]

export const SCOPES = [
  'Read balances and statements',
  'Ask for payments, only inside a passport you sign',
  'Keep a signed audit log of every action',
]

export const DONE_STEPS = ['Pairing code matched', 'Identity: live person · matches Singpass', 'Passport v1 signed on your key · ML-DSA-65']

export const PAIRING: Approval['device'] = {
  title: `Connect ${DETECTED.name}`,
  who: `${DOMAIN} · plugin v1.0`,
  amount: '482-915',
  detail: 'Pairing code · same as on screen?',
  note: 'Next: identity check on this key',
  faceCheck: true,
}
