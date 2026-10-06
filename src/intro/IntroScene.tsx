import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import CameraRig from './CameraRig'
import Desk from './Desk'
import MacBook from './MacBook'
import SigningDevice from './SigningDevice'
import { CAMERA, type CameraMode } from './layout'
import './intro.css'

const AUTOPLAY_MS = 1000
const ENTER_DELAY_MS = 1100
const FADE_MS = 500

const HINTS: Record<CameraMode, string> = {
  overview: 'Intent → Plan → Approval → Action → Proof',
  device: 'Click anywhere to go back',
  screen: 'Intent → Plan → Approval → Action → Proof',
}

export default function IntroScene({ onEnter }: { onEnter: () => void }) {
  const [mode, setMode] = useState<CameraMode>('overview')
  const [hovering, setHovering] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovering && mode !== 'screen' ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovering, mode])

  // Judges should not need to discover the interaction: push into the screen on its own.
  useEffect(() => {
    const t = setTimeout(() => setMode((m) => (m === 'overview' ? 'screen' : m)), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (mode !== 'screen') return
    const fade = setTimeout(() => setFading(true), ENTER_DELAY_MS)
    const enter = setTimeout(onEnter, ENTER_DELAY_MS + FADE_MS)
    return () => {
      clearTimeout(fade)
      clearTimeout(enter)
    }
  }, [mode, onEnter])

  const back = () => mode === 'device' && setMode('overview')

  return (
    <div className="intro">
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ position: CAMERA.overview.pos.toArray(), fov: 35 }}
        onPointerMissed={back}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 7, 5]} intensity={1.6} />
        <directionalLight position={[-5, 4, -2]} intensity={0.4} />

        {/* Local light rig for reflections; no network fetch needed */}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 5, -2]} scale={[10, 2, 1]} />
          <Lightformer intensity={1.4} position={[-5, 2, 3]} scale={[4, 4, 1]} />
          <Lightformer intensity={1} position={[5, 2, 3]} scale={[4, 4, 1]} />
        </Environment>

        <Desk />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={10} blur={2.8} far={2} color="#3a2f22" />

        <MacBook
          onScreenClick={(e) => {
            e.stopPropagation()
            setMode(mode === 'overview' ? 'screen' : 'overview')
          }}
          onScreenHover={setHovering}
        />
        <SigningDevice
          mode={mode}
          onClick={(e) => {
            e.stopPropagation()
            setMode(mode === 'device' ? 'overview' : 'device')
          }}
          onHover={setHovering}
        />
        <CameraRig mode={mode} />
      </Canvas>

      <header className={`intro__title${mode === 'device' ? ' is-hidden' : ''}`}>
        <span className="intro__kicker">Kairos · the transaction layer for AI agents</span>
        <span>Every agent carries a passport.</span>
      </header>
      {HINTS[mode] && <p className="intro__hint">{HINTS[mode]}</p>}
      <button className="intro__skip" onClick={onEnter}>
        Skip intro →
      </button>
      <div className={`intro__fade${fading ? ' is-on' : ''}`} />
    </div>
  )
}
