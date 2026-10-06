import { useState } from 'react'
import Sidebar from './Sidebar'
import AgentThread from './AgentThread'
import BankView from './BankView'
import PassportSettings from '../settings/PassportSettings'
import PluginPage from '../plugin/PluginPage'
import { DEFAULT_POLICIES, type Policy } from '../settings/permissions'
import SignerOverlay from '../signer/SignerOverlay'
import { OUTCOMES } from './checks'
import { AGENTS } from './agents'
import { useChecks } from './useChecks'
import SetupChat from '../setup/SetupChat'
import Tour from '../tour/Tour'
import type { CompanyId } from './companies'
import './layout.css'

type View = 'thread' | 'settings' | 'plugin'

export default function Workspace() {
  const [selected, setSelected] = useState(AGENTS[0].id)
  const [view, setView] = useState<View>('thread')
  const [bankOpen, setBankOpen] = useState(true)
  const [passportOpen, setPassportOpen] = useState(false)
  const [company, setCompany] = useState<CompanyId>('bakery')
  const [venturesConnected, setVenturesConnected] = useState(false)
  const [policies, setPolicies] = useState<Record<string, Policy>>(DEFAULT_POLICIES)
  const agent = AGENTS.find((a) => a.id === selected)!
  const { runs, log, run, note, signer, openSigner, decide } = useChecks()
  // Settings and plugin pages need the full width.
  const chatOnly = company === 'ventures'
  const showBank = bankOpen && view === 'thread' && !chatOnly

  const select = (id: string) => {
    setSelected(id)
    setView('thread')
  }

  const savePolicy = (p: Policy) => {
    setPolicies((all) => ({ ...all, [agent.id]: p }))
    note(`${agent.name} · passport v${p.version} signed by Alex`, 'ok')
  }

  return (
    <div className={`ws${showBank ? ' ws--bank' : ''}`}>
      <Sidebar
        selected={view === 'plugin' ? '' : selected}
        onSelect={select}
        pluginOpen={view === 'plugin'}
        onOpenPlugin={() => setView('plugin')}
        runs={runs}
        company={company}
        onCompany={(c) => {
          setCompany(c)
          setView('thread')
        }}
        connected={!chatOnly || venturesConnected}
      />
      <main className="panel ws__main">
        {chatOnly && view !== 'plugin' ? (
          <SetupChat connected={venturesConnected} onConnected={() => setVenturesConnected(true)} />
        ) : view === 'plugin' ? (
          <PluginPage onBack={() => setView('thread')} />
        ) : view === 'settings' ? (
          <PassportSettings
            key={agent.id}
            agent={agent}
            policy={policies[agent.id]}
            onSave={savePolicy}
            onBack={() => setView('thread')}
          />
        ) : (
          <AgentThread
            key={agent.id}
            agent={agent}
            checksDone={runs[agent.id]?.done ?? 0}
            decision={runs[agent.id]?.decision}
            bankOpen={bankOpen}
            onToggleBank={() => setBankOpen((v) => !v)}
            onOpenSettings={() => setView('settings')}
          />
        )}
      </main>
      {showBank && (
        <BankView
          agent={agent}
          run={runs[agent.id]}
          log={log}
          onRun={() => run(agent.id)}
          onOpenSigner={() => openSigner(agent.id)}
          onOpenPassport={() => setPassportOpen(true)}
        />
      )}
      {passportOpen && !signer && (
        <SignerOverlay
          passport={{
            who: `${agent.name} · ${agent.role} agent`,
            lines: [...agent.passport.split(' · '), 'Owner: Alex Lim', `Version ${policies[agent.id].version} · until 28 Oct 2035`],
          }}
          onClose={() => setPassportOpen(false)}
        />
      )}
      {!chatOnly && <Tour />}
      {signer && OUTCOMES[signer].approve && (
        <SignerOverlay
          key={signer}
          device={OUTCOMES[signer].approve!.device}
          onDecide={(d) => decide(signer, d)}
          onClose={() => openSigner(null)}
        />
      )}
    </div>
  )
}
