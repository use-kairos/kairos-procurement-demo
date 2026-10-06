import { useState } from 'react'
import { Check, ChevronsUpDown, ListFilter, MessageSquare, Plus, Search } from 'lucide-react'
import Avatar from './Avatar'
import { AGENTS } from './agents'
import { FILTERS, liveStatus, type Filter } from './status'
import type { Run } from './useChecks'
import { COMPANIES, type CompanyId } from './companies'
import './sidebar.css'
import KairosMark from '../brand/KairosMark'

type Props = {
  selected: string
  onSelect: (id: string) => void
  pluginOpen: boolean
  onOpenPlugin: () => void
  runs: Record<string, Run>
  company: CompanyId
  onCompany: (c: CompanyId) => void
  connected: boolean
}

export default function Sidebar({ selected, onSelect, pluginOpen, onOpenPlugin, runs, company, onCompany, connected }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [menu, setMenu] = useState(false)
  const [wsMenu, setWsMenu] = useState(false)
  const co = COMPANIES.find((c) => c.id === company)!
  const chatOnly = company === 'ventures'
  const agents = AGENTS.map((a) => ({ a, live: liveStatus(a, runs[a.id]) }))
  const count = (f: Filter) => (f === 'all' ? agents.length : agents.filter((x) => x.live.status === f).length)
  const shown = agents.filter((x) => filter === 'all' || x.live.status === filter)

  return (
    <aside className="sidebar">
      <div className="ws-wrap">
        <button className="ws-switch" onClick={() => setWsMenu((v) => !v)}>
          <span className="ws-switch__mark">C</span>
          <span className="ws-switch__text">
            <span className="ws-switch__name">Cowork</span>
            <span className="ws-switch__org">{co.name}</span>
          </span>
          <ChevronsUpDown size={15} className="ws-switch__chev" />
        </button>
        {wsMenu && (
          <div className="ws-menu" onMouseLeave={() => setWsMenu(false)}>
            {COMPANIES.map((c) => (
              <button
                key={c.id}
                className="ws-menu__opt"
                onClick={() => {
                  onCompany(c.id)
                  setWsMenu(false)
                }}
              >
                <span className="ws-menu__mark">{c.name[4]}</span>
                <span className="ws-menu__text">
                  <span>{c.name}</span>
                  <small>{c.hint}</small>
                </span>
                {c.id === company && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="search">
        <Search size={15} />
        <input placeholder="Search" disabled />
        <kbd>⌘K</kbd>
      </label>

      <div className="side-section">
        <span>Agents</span>
        <div className="filter">
          <button className={`filter__btn${filter !== 'all' ? ' is-on' : ''}`} onClick={() => setMenu((v) => !v)}>
            <ListFilter size={13} />
            {FILTERS.find((f) => f.id === filter)!.label}
          </button>
          {menu && (
            <div className="filter__menu" onMouseLeave={() => setMenu(false)}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`filter__opt${f.id === filter ? ' is-on' : ''}`}
                  onClick={() => {
                    setFilter(f.id)
                    setMenu(false)
                  }}
                >
                  {f.id !== 'all' && <span className={`avatar-status avatar-status--${f.id} filter__dot`} />}
                  {f.label}
                  <span className="filter__count">{count(f.id)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="icon-btn icon-btn--sm" aria-label="New agent">
          <Plus size={15} />
        </button>
      </div>
      {chatOnly ? (
        <nav className="agent-list">
          <button className="agent-row is-active">
            <span className="chat-mark">
              <MessageSquare size={16} />
            </span>
            <span className="agent-row__text">
              <span className="agent-row__top">
                <span className="agent-row__name">Chat</span>
              </span>
              <span className="agent-row__bottom">
                <span className="agent-row__doing">{connected ? 'Kairos connected' : 'No agents yet'}</span>
              </span>
            </span>
          </button>
        </nav>
      ) : (
      <nav className="agent-list">
        {shown.length === 0 && <div className="agent-empty">No agents in this state</div>}
        {shown.map(({ a, live }) => (
          <button
            key={a.id}
            className={`agent-row${a.id === selected ? ' is-active' : ''}`}
            onClick={() => onSelect(a.id)}
          >
            <Avatar id={a.id} color={a.color} size={38} status={live.status} />
            <span className="agent-row__text">
              <span className="agent-row__top">
                <span className="agent-row__name">{a.name}</span>
                <span className="agent-row__role">{a.role}</span>
                <span className={`row-status row-status--${live.status}`}>{live.label}</span>
              </span>
              <span className="agent-row__bottom">
                <span className="agent-row__doing">{a.doing}</span>
                {a.unread > 0 && <span className="agent-row__unread">{a.unread}</span>}
              </span>
            </span>
          </button>
        ))}
      </nav>
      )}

      <div className="side-section">
        <span>Connected</span>
      </div>
      {!connected ? (
        <div className="agent-empty">Nothing connected yet</div>
      ) : (
      <button className={`plugin-row${pluginOpen ? ' is-active' : ''}`} onClick={onOpenPlugin}>
        <span className="plugin-row__mark has-kairos-mark">
          <KairosMark size={24} />
        </span>
        <span className="plugin-row__text">
          <span className="plugin-row__name">Kairos</span>
          <span className="plugin-row__sub">Payments · credit</span>
        </span>
        <span className="plugin-row__badge">Verified</span>
      </button>
      )}

      <div className="me-card">
        <span className="me-card__avatar">AL</span>
        <span className="me-card__text">
          <span className="me-card__name">Alex Lim</span>
          <span className="me-card__org">Owner · {co.legal}</span>
        </span>
      </div>
    </aside>
  )
}
