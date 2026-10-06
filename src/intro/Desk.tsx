import { RoundedBox } from '@react-three/drei'

// Light oak desk and a couple of props, so the scene reads as a real workspace.
export default function Desk() {
  return (
    <group>
      <RoundedBox args={[11, 0.16, 6]} radius={0.04} position={[0.4, -0.08, -0.4]}>
        <meshStandardMaterial color="#d9c9ae" roughness={0.7} />
      </RoundedBox>

      {/* Coffee mug */}
      <group position={[-2.35, 0, 0.55]}>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.48, 40]} />
          <meshStandardMaterial color="#f7f6f3" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.455, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.18, 40]} />
          <meshStandardMaterial color="#3b2418" roughness={0.2} />
        </mesh>
        {/* Half-torus on the outer side of the mug, open end against the wall */}
        <mesh position={[0.19, 0.25, 0]} rotation-z={-Math.PI / 2}>
          <torusGeometry args={[0.11, 0.03, 16, 40, Math.PI]} />
          <meshStandardMaterial color="#f7f6f3" roughness={0.3} />
        </mesh>
      </group>

      {/* Closed notebook with a pen */}
      <group position={[-2.2, 0, -1.05]} rotation-y={0.35}>
        <RoundedBox args={[0.95, 0.05, 1.25]} radius={0.015} position={[0, 0.025, 0]}>
          <meshStandardMaterial color="#1f2a37" roughness={0.8} />
        </RoundedBox>
        <mesh position={[0.2, 0.065, 0]} rotation={[Math.PI / 2, 0, 0.2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.95, 16]} />
          <meshStandardMaterial color="#c8a35a" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}
