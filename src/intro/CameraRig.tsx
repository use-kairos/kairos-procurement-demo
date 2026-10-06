import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { CAMERA, type CameraMode } from './layout'

const SPEED: Record<CameraMode, number> = { overview: 3, device: 4.5, screen: 3 }

// Eases the camera toward the pose for the current mode, with a slow drift while idle.
export default function CameraRig({ mode }: { mode: CameraMode }) {
  const look = useRef(CAMERA.overview.look.clone())
  const pos = useRef(new Vector3())

  useFrame(({ camera, clock }, dt) => {
    const target = CAMERA[mode]
    const k = 1 - Math.exp(-dt * SPEED[mode])
    pos.current.copy(target.pos)
    if (mode === 'overview') {
      const t = clock.elapsedTime * 0.25
      pos.current.x += Math.sin(t) * 0.35
      pos.current.y += Math.sin(t * 1.3) * 0.08
    }
    camera.position.lerp(pos.current, k)
    look.current.lerp(target.look, k)
    camera.lookAt(look.current)
  })

  return null
}
