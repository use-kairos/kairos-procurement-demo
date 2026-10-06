import { UI_FONT, roundRect } from '../intro/textures'
import type { Approval } from '../workspace/checks'

export type Phase = 'review' | 'face' | 'pin' | 'signing' | 'signed' | 'rejected' | 'passport'

export const SCREEN_W = 560
export const SCREEN_H = 620
export const PIN_LENGTH = 6

// Touch keypad shown on the glass while entering the PIN.
const PAD = { x: 36, y: 214, w: SCREEN_W - 72, h: 390, cols: 3, rows: 4 }
export const PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']


function header(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, SCREEN_H)
  bg.addColorStop(0, '#0f0f13')
  bg.addColorStop(1, '#1b1b21')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = `600 21px ${UI_FONT}`
  ctx.fillText('Certainty Bank', 32, 50)
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(SCREEN_W - 118, 43, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `500 20px ${UI_FONT}`
  ctx.fillText('Linked', SCREEN_W - 104, 50)
}

function centre(ctx: CanvasRenderingContext2D, text: string, y: number, font: string, color: string) {
  ctx.textAlign = 'center'
  ctx.fillStyle = color
  ctx.font = font
  ctx.fillText(text, SCREEN_W / 2, y)
}

// Draws the signing-key display for the current step of the approval flow.
export type PassportView = { who: string; lines: string[] }

export function drawSigner(
  ctx: CanvasRenderingContext2D,
  d: Approval['device'] | PassportView,
  phase: Phase,
  pin: number,
  hit: string | null = null,
  scan = 0,
) {
  header(ctx)

  // Identity check: the key's own camera looks at Alex; progress 0..1, done at 1.
  if (phase === 'face') {
    const done = scan >= 1
    centre(ctx, '▲  camera', 88, `500 18px ${UI_FONT}`, 'rgba(255,255,255,0.45)')
    centre(ctx, done ? 'Identity checked' : 'Look at the camera', 130, `600 32px ${UI_FONT}`, '#ffffff')
    const cx = SCREEN_W / 2, cy = 312, rx = 112, ry = 140
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2)
    if (!done) {
      const y = cy - ry + scan * ry * 2
      const g = ctx.createLinearGradient(0, y - 40, 0, y)
      g.addColorStop(0, 'rgba(74,222,128,0)')
      g.addColorStop(1, 'rgba(74,222,128,0.35)')
      ctx.fillStyle = g
      ctx.fillRect(cx - rx, y - 40, rx * 2, 40)
      ctx.fillStyle = '#4ade80'
      ctx.fillRect(cx - rx, y - 2, rx * 2, 3)
    }
    ctx.restore()
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.lineWidth = 4
    ctx.strokeStyle = done ? '#4ade80' : 'rgba(255,255,255,0.4)'
    ctx.stroke()
    centre(ctx, done ? '✓  Live person · matches Singpass' : 'Checking liveness…', 506, `500 22px ${UI_FONT}`, done ? '#4ade80' : 'rgba(255,255,255,0.7)')
    centre(ctx, 'The image never leaves this key', 560, `400 19px ${UI_FONT}`, 'rgba(255,255,255,0.45)')
    return
  }

  if (phase === 'passport' && 'lines' in d) {
    ctx.textAlign = 'left'
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 38px ${UI_FONT}`
    ctx.fillText('Agent passport', 32, 118)
    ctx.fillStyle = 'rgba(255,255,255,0.07)'
    roundRect(ctx, 24, 146, SCREEN_W - 48, 330, 26)
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 30px ${UI_FONT}`
    ctx.fillText(d.who, 52, 200)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = `400 22px ${UI_FONT}`
    d.lines.forEach((l, i) => ctx.fillText(l, 52, 250 + i * 40))
    ctx.fillStyle = '#4ade80'
    ctx.font = `500 21px ${UI_FONT}`
    ctx.fillText('✓  Signed · ML-DSA-65', 52, 446)
    centre(ctx, 'The key never leaves this device', 560, `400 20px ${UI_FONT}`, 'rgba(255,255,255,0.45)')
    return
  }
  if ('lines' in d) return

  if (phase === 'review') {
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 38px ${UI_FONT}`
    ctx.fillText(d.title, 32, 118)
    ctx.fillStyle = 'rgba(255,255,255,0.07)'
    roundRect(ctx, 24, 146, SCREEN_W - 48, 260, 26)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = `500 22px ${UI_FONT}`
    ctx.fillText(d.who, 52, 194)
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 58px ${UI_FONT}`
    ctx.fillText(d.amount, 50, 266)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = `400 22px ${UI_FONT}`
    ctx.fillText(d.detail, 52, 306)
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(52, 334, SCREEN_W - 104, 2)
    ctx.fillStyle = '#93c5fd'
    ctx.font = `500 21px ${UI_FONT}`
    ctx.fillText(d.note ?? 'Outside the passport · needs you', 52, 378)
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, SCREEN_W / 2 - 150, 520, 300, 56, 28)
    centre(ctx, 'Press OK to sign', 556, `600 22px ${UI_FONT}`, '#0f0f13')
    return
  }

  if (phase === 'pin') {
    centre(ctx, 'Enter PIN', 112, `600 34px ${UI_FONT}`, '#ffffff')
    for (let i = 0; i < 6; i++) {
      const x = SCREEN_W / 2 - 100 + i * 40
      ctx.beginPath()
      ctx.arc(x, 162, 11, 0, Math.PI * 2)
      if (i < pin) {
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 3
        ctx.stroke()
      }
    }
    const cw = PAD.w / PAD.cols
    const ch = PAD.h / PAD.rows
    PAD_KEYS.forEach((k, i) => {
      if (!k) return
      const x = PAD.x + (i % PAD.cols) * cw
      const y = PAD.y + Math.floor(i / PAD.cols) * ch
      ctx.fillStyle = k === hit ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.08)'
      roundRect(ctx, x + 6, y + 6, cw - 12, ch - 12, 18)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.font = `500 40px ${UI_FONT}`
      ctx.fillText(k, x + cw / 2, y + ch / 2 + 14)
    })
    return
  }

  if (phase === 'signing') {
    centre(ctx, 'Signing…', 300, `600 42px ${UI_FONT}`, '#ffffff')
    centre(ctx, 'ML-DSA-65 · key never leaves this device', 350, `400 21px ${UI_FONT}`, 'rgba(255,255,255,0.55)')
    return
  }

  const ok = phase === 'signed'
  ctx.fillStyle = ok ? '#16a34a' : '#dc2626'
  ctx.beginPath()
  ctx.arc(SCREEN_W / 2, 250, 64, 0, Math.PI * 2)
  ctx.fill()
  centre(ctx, ok ? '✓' : '✕', 276, `700 72px ${UI_FONT}`, '#ffffff')
  centre(ctx, ok ? 'Signed' : 'Rejected', 392, `600 42px ${UI_FONT}`, '#ffffff')
  centre(ctx, ok ? 'Sent to Certainty Bank' : 'Nothing moved', 438, `400 22px ${UI_FONT}`, 'rgba(255,255,255,0.55)')
}
