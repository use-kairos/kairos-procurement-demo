import type { AgentStatus } from './agents'

type Props = { id: string; size?: number; status?: AgentStatus; color?: string }

// DiceBear "avataaars" portraits, vendored in public/avatars so the demo works offline.
export default function Avatar({ id, size = 40, status, color }: Props) {
  return (
    <span className="avatar-wrap" style={{ width: size, height: size }}>
      <img
        className="avatar-img"
        src={`/avatars/${id}.svg`}
        width={size}
        height={size}
        alt=""
        style={{ background: color }}
      />
      {status && <span className={`avatar-status avatar-status--${status}`} />}
    </span>
  )
}
