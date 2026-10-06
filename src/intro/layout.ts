import { Vector3 } from 'three'

// All sizes in scene units. The laptop sits centred on the desk at the origin.
export const BASE = { w: 3, h: 0.1, d: 2.1 }
export const LID = { h: 2, t: 0.05, tilt: -0.28 }
export const SCREEN = { w: 2.76, h: 1.72 }

// Keyboard well on the top of the base (x from -w/2 to w/2, z from z0 to z0 + d).
export const KEYBOARD = { w: 2.6, d: 0.94, z0: -0.92, cols: 14 }
const rowUnit = KEYBOARD.d / 5.5 // function row is half height, then five full rows
export const FN_ROW_H = rowUnit * 0.5

// Touch ID sits in the last slot of the function row, like on a real MacBook.
export const TOUCH_ID = new Vector3(
  KEYBOARD.w / 2 - KEYBOARD.w / KEYBOARD.cols / 2,
  BASE.h + 0.004,
  KEYBOARD.z0 + FN_ROW_H / 2,
)

// Lid hinge is the back edge of the base; the lid tilts back by LID.tilt.
export const HINGE = new Vector3(0, BASE.h / 2, -BASE.d / 2)
const tiltAxis = new Vector3(1, 0, 0)
export const SCREEN_CENTER = new Vector3(0, LID.h / 2, LID.t / 2 + 0.002)
  .applyAxisAngle(tiltAxis, LID.tilt)
  .add(HINGE)
export const SCREEN_NORMAL = new Vector3(0, 0, 1).applyAxisAngle(tiltAxis, LID.tilt)

// External signing device (like a bank USB token), lying on the desk right of the laptop.
export const DEVICE = { pos: new Vector3(2.3, 0, 0.4), rotY: 0.22, w: 0.58, h: 0.05, d: 0.92 }
// USB-C port on the right side of the base, where the cable plugs in.
export const PORT = new Vector3(BASE.w / 2 + 0.01, BASE.h / 2, -0.3)

export type CameraMode = 'overview' | 'device' | 'screen'

export const CAMERA: Record<CameraMode, { pos: Vector3; look: Vector3 }> = {
  overview: { pos: new Vector3(3.9, 2.9, 5.2), look: new Vector3(0.5, 0.45, -0.1) },
  device: {
    pos: DEVICE.pos.clone().add(new Vector3(-0.35, 1.7, 1.9)),
    look: DEVICE.pos.clone().add(new Vector3(-0.5, 0.05, 0)),
  },
  screen: {
    pos: SCREEN_CENTER.clone().add(SCREEN_NORMAL.clone().multiplyScalar(1.15)),
    look: SCREEN_CENTER.clone(),
  },
}
