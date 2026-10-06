import { CardHead } from './BankCard'
import type { InfoCard as Card } from './agents'
import './cards.css'

// Inline card an agent drops into the conversation (loan request, held refund, …).
export default function InfoCard({ card }: { card: Card }) {
  return (
    <section className={`bcard bcard--${card.tone}`}>
      <CardHead title={card.title} />

      <div className="bcard__figure">
        <span className="bcard__amount num">{card.figure}</span>
        <span className={`tone-pill tone-pill--${card.tone}`}>{card.status}</span>
      </div>
      <div className="bcard__figure-label">{card.figureLabel}</div>

      <dl className="bcard__rows">
        {card.rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      {card.note && <p className="bcard__note">{card.note}</p>}
    </section>
  )
}
