import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from 'three'
import DeviceModel, { type DeviceKey } from '../intro/DeviceModel'
import type { Approval, Decision } from '../workspace/checks'
import { PIN_LENGTH, SCREEN_H, SCREEN_W, drawSigner, type PassportView, type Phase } from './signerScreen'
import './signer.css'

// Either a request to sign, or just a look at an agent's passport.
type Props =
  | { device: Approval['device']; passport?: never; onDecide: (d: Decision) => void; onClose: () => void }
  | { passport: PassportView; device?: never; onDecide?: never; onClose: () => void }

const DEMO_PIN = '482915'
const PIN_STEP_MS = 170
const FACE_MS = 2200
const FACE_STEPS = 44

// Drops in from above, tilts toward the viewer, and flies away when done.
function Floating({ leaving, children }: { leaving: boolean; children: React.ReactNode }) {
  const g = useRef<Group>(null)
  useFrame(({ clock }, dt) => {
    if (!g.current) return
    const k = 1 - Math.exp(-dt * (leaving ? 7 : 5))
    const targetY = leaving ? 2.6 : Math.sin(clock.elapsedTime * 1.4) * 0.015
    g.current.position.y = MathUtils.lerp(g.current.position.y, targetY, k)
    g.current.rotation.z = MathUtils.lerp(g.current.rotation.z, leaving ? 0.25 : Math.sin(clock.elapsedTime * 0.8) * 0.03, k)
  })
  return (
    <group ref={g} position={[0, 2.6, 0]}>
      {children}
    </group>
  )
}

export default function SignerOverlay({ device, passport, onDecide, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>(passport ? 'passport' : 'review')
  const [pin, setPin] = useState(0)
  const [scan, setScan] = useState(0)
  const [hit, setHit] = useState<string | null>(null)
  const [pressed, setPressed] = useState<DeviceKey | null>(null)
  const [leaving, setLeaving] = useState(false)
  const timers = useRef<number[]>([])
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return { canvas, texture }
  }, [])

  useEffect(() => {
    drawSigner(canvas.getContext('2d')!, passport ?? device!, phase, pin, hit, scan)
    texture.needsUpdate = true
  }, [canvas, texture, device, passport, phase, pin, hit, scan])

  const leave = (then: () => void) => {
    setLeaving(true)
    later(450, then)
  }

  // After OK: (optional face scan on the key's camera), the keypad types the PIN by itself, then the key signs and flies off.
  const autoSign = () => {
    let t = 0
    if (device?.faceCheck) {
      setPhase('face')
      setScan(0)
      for (let i = 1; i <= FACE_STEPS; i++) later((i * FACE_MS) / FACE_STEPS, () => setScan(i / FACE_STEPS))
      t = FACE_MS + 800
    }
    later(t, () => setPhase('pin'))
    ;[...DEMO_PIN].forEach((d, i) => {
      later(t + 300 + i * PIN_STEP_MS, () => {
        setHit(d)
        setPin(i + 1)
      })
      later(t + 300 + i * PIN_STEP_MS + 110, () => setHit(null))
    })
    const typed = t + 300 + PIN_LENGTH * PIN_STEP_MS
    later(typed + 200, () => setPhase('signing'))
    later(typed + 1100, () => setPhase('signed'))
    later(typed + 1950, () => leave(() => onDecide?.('approved')))
  }

  const press = useCallback(
    (k: DeviceKey) => {
      if (leaving) return
      setPressed(k)
      later(140, () => setPressed(null))
      if (phase === 'passport') return leave(onClose)
      if (phase === 'review') {
        if (k === 'OK') autoSign()
        else if (k === 'REJECT') {
          setPhase('rejected')
          later(1000, () => leave(() => onDecide?.('rejected')))
        } else leave(onClose)
      } else if (phase === 'pin' && k === 'BACK') {
        clearTimers()
        setPin(0)
        setHit(null)
        setPhase('review')
      }
    },
    [phase, leaving, onDecide, onClose],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') press('OK')
      else if (e.key === 'x' || e.key === 'X') press('REJECT')
      else if (e.key === 'Escape') press('BACK')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  return (
    <div className={`signer${leaving ? ' is-leaving' : ''}`}>
      <div className="signer__stage">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 2.2], fov: 30 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 4]} intensity={1.6} />
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 4, 2]} scale={[6, 2, 1]} />
            <Lightformer intensity={1} position={[-4, 0, 3]} scale={[3, 3, 1]} />
          </Environment>
          <Floating leaving={leaving}>
            <group rotation-x={1.2}>
              <group position={[0, -0.025, 0]}>
                <DeviceModel screen={texture} pressed={pressed} onKey={press} cameraOn={phase === 'face'} />
              </group>
            </group>
          </Floating>
        </Canvas>
      </div>
      <div className="signer__caption">
        <div className="signer__title">Alex's signing key</div>
        <div className="signer__keys">
          {passport ? (
            <span>
              <kbd>↩</kbd> put back <em>Esc</em>
            </span>
          ) : (
            <>
              <span>
                <kbd>OK</kbd> sign <em>Enter</em>
              </span>
              <span>
                <kbd>✕</kbd> reject <em>X</em>
              </span>
              <span>
                <kbd>↩</kbd> back <em>Esc</em>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
