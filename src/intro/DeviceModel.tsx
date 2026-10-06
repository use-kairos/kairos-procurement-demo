import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { MathUtils, type Group, type Texture } from 'three'
import { keyLabelTexture } from './textures'
import { DEVICE } from './layout'

export type DeviceKey = 'BACK' | 'REJECT' | 'OK'

const GLASS = { w: 0.5, h: 0.554, z: -0.12 }
const KEYS: { label: DeviceKey; text: string; x: number; primary: boolean }[] = [
  { label: 'BACK', text: '↩', x: -0.16, primary: false },
  { label: 'REJECT', text: '✕', x: 0, primary: false },
  { label: 'OK', text: 'OK', x: 0.16, primary: true },
]
const KEY = { w: 0.13, d: 0.075, z: 0.33 }
const CAM = { z: -0.436, y: 0.0016 }

type Props = {
  screen: Texture
  pressed?: DeviceKey | null
  onKey?: (k: DeviceKey) => void
  onBodyClick?: (e: ThreeEvent<MouseEvent>) => void
  onHover?: (hovering: boolean) => void
  cameraOn?: boolean
}

function Key({ k, label, pressed, onKey }: { k: (typeof KEYS)[number]; label: Texture; pressed: boolean; onKey?: (k: DeviceKey) => void }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = MathUtils.lerp(ref.current.position.y, pressed ? -0.008 : 0, 1 - Math.exp(-dt * 30))
  })
  return (
    <group position={[k.x, DEVICE.h, KEY.z]}>
      <group
        ref={ref}
        onClick={
          onKey &&
          ((e) => {
            e.stopPropagation()
            onKey(k.label)
          })
        }
        onPointerOver={() => onKey && (document.body.style.cursor = 'pointer')}
        onPointerOut={() => onKey && (document.body.style.cursor = 'auto')}
      >
        <RoundedBox args={[KEY.w, 0.014, KEY.d]} radius={0.006} position={[0, 0.005, 0]}>
          <meshStandardMaterial color={k.primary ? '#f4f4f5' : '#2a2b30'} roughness={0.45} />
        </RoundedBox>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.0125, 0]}>
          <planeGeometry args={[KEY.w - 0.012, KEY.d - 0.012]} />
          <meshBasicMaterial map={label} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

// The bank signing key: graphite body, glass display, a row of small keys.
// Small camera centred in the top bezel, for the identity check; the LED glows while it looks.
function Camera({ on }: { on: boolean }) {
  const y = DEVICE.h + CAM.y
  return (
    <group rotation-x={-Math.PI / 2}>
      <mesh position={[0, -CAM.z, y]}>
        <circleGeometry args={[0.014, 32]} />
        <meshStandardMaterial color="#070708" roughness={0.3} />
      </mesh>
      <mesh position={[0, -CAM.z, y + 0.0005]}>
        <circleGeometry args={[0.008, 32]} />
        <meshStandardMaterial color="#1c2a4a" roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh position={[-0.003, -CAM.z + 0.003, y + 0.001]}>
        <circleGeometry args={[0.0022, 16]} />
        <meshBasicMaterial color="#9fb4ff" />
      </mesh>
      <mesh position={[0.032, -CAM.z, y]}>
        <circleGeometry args={[0.0045, 16]} />
        <meshBasicMaterial color={on ? '#4ade80' : '#1d1e22'} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function DeviceModel({ screen, pressed, onKey, onBodyClick, onHover, cameraOn = false }: Props) {
  const labels = useMemo(() => KEYS.map((k) => keyLabelTexture(k.text, k.primary)), [])

  return (
    <group>
      <group onClick={onBodyClick} onPointerOver={() => onHover?.(true)} onPointerOut={() => onHover?.(false)}>
        <RoundedBox args={[DEVICE.w, DEVICE.h, DEVICE.d]} radius={0.022} smoothness={5} position={[0, DEVICE.h / 2, 0]}>
          <meshStandardMaterial color="#3a3b40" metalness={0.8} roughness={0.32} />
        </RoundedBox>
        <mesh rotation-x={-Math.PI / 2} position={[0, DEVICE.h + 0.001, GLASS.z]}>
          <planeGeometry args={[GLASS.w + 0.03, GLASS.h + 0.03]} />
          <meshStandardMaterial color="#050506" roughness={0.08} metalness={0.2} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, DEVICE.h + 0.002, GLASS.z]}>
          <planeGeometry args={[GLASS.w, GLASS.h]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <Camera on={cameraOn} />
        {/* Keys sit inside the clickable body so the intro can treat the whole device as one target */}
        {KEYS.map((k, i) => (
          <Key key={k.label} k={k} label={labels[i]} pressed={pressed === k.label} onKey={onKey} />
        ))}
      </group>
    </group>
  )
}
