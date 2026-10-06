import { useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import { CatmullRomCurve3, Vector3 } from 'three'
import PassportCard from '../passport/PassportCard'
import { deviceScreenTexture } from './textures'
import DeviceModel from './DeviceModel'
import { DEVICE, PORT, type CameraMode } from './layout'

type Props = {
  mode: CameraMode
  onClick: (e: ThreeEvent<MouseEvent>) => void
  onHover: (hovering: boolean) => void
}

const Y_AXIS = new Vector3(0, 1, 0)
const toWorld = (local: Vector3) => local.applyAxisAngle(Y_AXIS, DEVICE.rotY).add(DEVICE.pos)

function UsbPlug({ position, rotY }: { position: Vector3; rotY: number }) {
  return (
    <RoundedBox args={[0.06, 0.03, 0.1]} radius={0.012} position={position} rotation-y={rotY}>
      <meshStandardMaterial color="#e9e9ea" roughness={0.35} metalness={0.2} />
    </RoundedBox>
  )
}

export default function SigningDevice({ mode, onClick, onHover }: Props) {
  const screen = useMemo(deviceScreenTexture, [])
  const plugAtDevice = useMemo(() => toWorld(new Vector3(0, DEVICE.h / 2, -DEVICE.d / 2 - 0.05)), [])
  const plugAtLaptop = PORT.clone().add(new Vector3(0.05, 0, 0))
  const cable = useMemo(
    () =>
      new CatmullRomCurve3([
        plugAtDevice.clone().add(toWorld(new Vector3(0, 0, -0.05)).sub(DEVICE.pos)),
        plugAtDevice.clone().add(new Vector3(-0.05, -0.02, -0.3)),
        new Vector3(1.95, 0.012, -0.6),
        PORT.clone().add(new Vector3(0.28, -0.03, 0)),
        plugAtLaptop.clone().add(new Vector3(0.05, 0, 0)),
      ]),
    [],
  )

  return (
    <group>
      {/* White USB-C cable with plugs at both ends */}
      <mesh>
        <tubeGeometry args={[cable, 80, 0.011, 10, false]} />
        <meshStandardMaterial color="#efefef" roughness={0.5} />
      </mesh>
      <UsbPlug position={plugAtDevice} rotY={DEVICE.rotY} />
      <UsbPlug position={plugAtLaptop} rotY={Math.PI / 2} />

      <group position={DEVICE.pos} rotation-y={DEVICE.rotY}>
        <DeviceModel screen={screen} onBodyClick={onClick} onHover={onHover} />

        {mode === 'overview' && (
          <Html position={[0, 0.05, 0.72]} center zIndexRange={[10, 0]}>
            <div className="chip-tag">Signing key</div>
          </Html>
        )}
      </group>

      <Html position={DEVICE.pos.clone().add(new Vector3(-1.1, 0.25, 0.25))} center zIndexRange={[10, 0]}>
        <div className={`passport-float${mode === 'device' ? ' is-visible' : ''}`}>
          <PassportCard />
          <p className="passport-float__caption">The signing key lives in this device. It never leaves.</p>
        </div>
      </Html>
    </group>
  )
}
