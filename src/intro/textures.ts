import { CanvasTexture, SRGBColorSpace } from 'three'
import { FN_ROW_H, KEYBOARD } from './layout'

export const UI_FONT = '"Inter Variable", -apple-system, "Helvetica Neue", sans-serif'

export function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  return { canvas, ctx: canvas.getContext('2d')! }
}

export function finish(canvas: HTMLCanvasElement) {
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
}

// Black keys on a transparent background. The last function-row slot stays empty for Touch ID.
export function keyboardTexture() {
  const pxPerUnit = 400
  const W = Math.round(KEYBOARD.w * pxPerUnit)
  const H = Math.round(KEYBOARD.d * pxPerUnit)
  const { canvas, ctx } = makeCanvas(W, H)
  const colW = W / KEYBOARD.cols
  const fnH = FN_ROW_H * pxPerUnit
  const rowH = (H - fnH) / 5
  const gap = 7
  ctx.fillStyle = '#161618'

  for (let c = 0; c < KEYBOARD.cols - 1; c++) roundRect(ctx, c * colW + gap / 2, gap / 2, colW - gap, fnH - gap, 6)

  // Five rows with a few wide keys at the ends, roughly like a real layout.
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
    [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.7],
    [1, 1, 1, 1.3, 5.6, 1.3, 1, 1.8],
  ]
  rows.forEach((units, r) => {
    const total = units.reduce((a, b) => a + b, 0)
    const unitW = W / total
    let x = 0
    const y = fnH + r * rowH
    units.forEach((u) => {
      roundRect(ctx, x + gap / 2, y + gap / 2, u * unitW - gap, rowH - gap, 8)
      x += u * unitW
    })
  })
  return finish(canvas)
}

// A miniature of the Cowork workspace, so zooming into the screen flows into the 2D app.
export function screenTexture() {
  const W = 1380
  const H = 860
  const { canvas, ctx } = makeCanvas(W, H)
  const panel = (x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, x, y, w, h, 18)
    ctx.strokeStyle = '#e8e8e4'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 18)
    ctx.stroke()
  }
  ctx.fillStyle = '#f4f4f1'
  ctx.fillRect(0, 0, W, H)

  // Sidebar: brand + three agents.
  ctx.fillStyle = '#0e0e10'
  roundRect(ctx, 22, 22, 40, 40, 10)
  ctx.font = `600 24px ${UI_FONT}`
  ctx.fillText('Cowork', 76, 50)
  const agents = ['#e9dcc6', '#cfe2d6', '#ded5ea']
  agents.forEach((c, i) => {
    const y = 120 + i * 70
    if (i === 0) {
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, 14, y - 8, 262, 62, 14)
    }
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(46, y + 23, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0e0e10'
    roundRect(ctx, 78, y + 6, 60, 12, 6)
    ctx.fillStyle = '#d6d6d1'
    roundRect(ctx, 78, y + 28, 150 - i * 20, 10, 5)
  })

  // Conversation panel.
  panel(292, 12, 700, H - 24)
  ctx.fillStyle = '#f1f1ee'
  roundRect(ctx, 340, 110, 420, 50, 20)
  roundRect(ctx, 340, 176, 300, 50, 20)
  ctx.strokeStyle = '#e8e8e4'
  ctx.beginPath()
  ctx.roundRect(340, 250, 380, 250, 18)
  ctx.stroke()
  ctx.fillStyle = '#0e0e10'
  ctx.font = `600 44px ${UI_FONT}`
  ctx.fillText('SGD 480.00', 364, 330)
  ctx.fillStyle = '#f8f8f6'
  roundRect(ctx, 364, 360, 332, 54, 12)
  ctx.fillStyle = '#0e0e10'
  roundRect(ctx, 790, 540, 170, 46, 20)
  ctx.strokeStyle = '#d6d6d1'
  ctx.beginPath()
  ctx.roundRect(330, H - 110, 620, 60, 20)
  ctx.stroke()

  // Kairos view panel: six checks.
  panel(1004, 12, 364, H - 24)
  ctx.fillStyle = '#0e0e10'
  ctx.font = `600 24px ${UI_FONT}`
  ctx.fillText('Kairos view', 1030, 56)
  ctx.fillStyle = '#f8f8f6'
  roundRect(ctx, 1026, 90, 320, 110, 14)
  for (let i = 0; i < 6; i++) {
    const y = 240 + i * 62
    ctx.strokeStyle = '#d6d6d1'
    ctx.beginPath()
    ctx.arc(1044, y + 12, 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#d6d6d1'
    roundRect(ctx, 1070, y + 4, 170 - (i % 3) * 25, 14, 7)
  }
  return finish(canvas)
}

// Glass display on the signing device: a modern "confirm what you sign" screen.
export function deviceScreenTexture() {
  const W = 560
  const H = 620
  const { canvas, ctx } = makeCanvas(W, H)
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0f0f13')
  bg.addColorStop(1, '#1b1b21')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = `600 21px ${UI_FONT}`
  ctx.fillText('Kairos', 32, 50)
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(W - 118, 43, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `500 20px ${UI_FONT}`
  ctx.fillText('Linked', W - 104, 50)

  ctx.fillStyle = '#ffffff'
  ctx.font = `600 40px ${UI_FONT}`
  ctx.fillText('Sign payment', 32, 118)

  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  roundRect(ctx, 24, 146, W - 48, 290, 26)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = `500 22px ${UI_FONT}`
  ctx.fillText('Pip · Procurement agent', 52, 194)
  ctx.fillStyle = '#ffffff'
  ctx.font = `600 58px ${UI_FONT}`
  ctx.fillText('SGD 480.00', 50, 266)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = `400 22px ${UI_FONT}`
  ctx.fillText('to Tan Supplies Pte. Ltd.', 52, 304)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fillRect(52, 336, W - 104, 2)
  ctx.fillStyle = '#4ade80'
  ctx.font = `500 22px ${UI_FONT}`
  ctx.fillText('✓  Passport valid · ML-DSA-65', 52, 390)

  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = `400 20px ${UI_FONT}`
  ctx.fillText('Limit ≤ SGD 1,000 · known suppliers', 32, 490)

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, W / 2 - 150, 530, 300, 56, 28)
  ctx.fillStyle = '#0f0f13'
  ctx.font = `600 22px ${UI_FONT}`
  ctx.textAlign = 'center'
  ctx.fillText('Press OK to sign', W / 2, 566)
  return finish(canvas)
}

// Printed label on a small hardware key.
export function keyLabelTexture(label: string, dark: boolean) {
  const { canvas, ctx } = makeCanvas(192, 112)
  ctx.fillStyle = dark ? '#f4f4f5' : '#2a2b30'
  ctx.fillRect(0, 0, 192, 112)
  ctx.fillStyle = dark ? '#0f0f13' : 'rgba(255,255,255,0.85)'
  ctx.font = `600 34px ${UI_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 96, 58)
  return finish(canvas)
}
