import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { BASE, HINGE, KEYBOARD, LID, SCREEN, TOUCH_ID } from './layout'
import { keyboardTexture, screenTexture } from './textures'

const ALUMINIUM = { color: '#c8cacf', metalness: 0.75, roughness: 0.32 }

type Props = {
  onScreenClick: (e: ThreeEvent<MouseEvent>) => void
  onScreenHover: (hovering: boolean) => void
}

export default function MacBook({ onScreenClick, onScreenHover }: Props) {
  const keys = useMemo(keyboardTexture, [])
  const screen = useMemo(screenTexture, [])

  return (
    <group>
      {/* Base */}
      <RoundedBox args={[BASE.w, BASE.h, BASE.d]} radius={0.04} smoothness={4} position={[0, BASE.h / 2, 0]}>
        <meshStandardMaterial {...ALUMINIUM} />
      </RoundedBox>

      {/* Keyboard well */}
      <mesh rotation-x={-Math.PI / 2} position={[0, BASE.h + 0.002, KEYBOARD.z0 + KEYBOARD.d / 2]}>
        <planeGeometry args={[KEYBOARD.w, KEYBOARD.d]} />
        <meshStandardMaterial map={keys} transparent roughness={0.6} />
      </mesh>

      {/* Touch ID key (plain; the signing key is the external device) */}
      <RoundedBox args={[0.15, 0.01, 0.067]} radius={0.004} position={TOUCH_ID}>
        <meshStandardMaterial color="#161618" roughness={0.35} />
      </RoundedBox>

      {/* Trackpad */}
      <mesh rotation-x={-Math.PI / 2} position={[0, BASE.h + 0.001, 0.56]}>
        <planeGeometry args={[1.3, 0.78]} />
        <meshStandardMaterial color="#b9bbc0" metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Lid, hinged at the back edge of the base */}
      <group position={HINGE} rotation-x={LID.tilt}>
        <RoundedBox args={[BASE.w, LID.h, LID.t]} radius={0.03} smoothness={4} position={[0, LID.h / 2, 0]}>
          <meshStandardMaterial {...ALUMINIUM} />
        </RoundedBox>
        <mesh position={[0, LID.h / 2, LID.t / 2 + 0.001]}>
          <planeGeometry args={[BASE.w - 0.06, LID.h - 0.06]} />
          <meshStandardMaterial color="#050506" roughness={0.2} />
        </mesh>
        <mesh
          position={[0, LID.h / 2, LID.t / 2 + 0.002]}
          onClick={onScreenClick}
          onPointerOver={() => onScreenHover(true)}
          onPointerOut={() => onScreenHover(false)}
        >
          <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
