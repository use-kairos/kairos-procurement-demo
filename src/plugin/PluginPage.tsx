import { ArrowLeft, FileSignature, IdCard, KeyRound, Network, ShieldCheck } from 'lucide-react'
import { PLATFORMS, STANDARDS } from './platforms'
import './plugin.css'

const GIVES = [
  { icon: IdCard, title: 'Passport', text: 'Bank-signed limits: which accounts, how much, which payees, until when.' },
  { icon: KeyRound, title: 'Signing key', text: "Anything outside the passport waits for the owner's hardware key." },
  { icon: Network, title: 'Agent handshake', text: "Checks the other side's passport before your agent deals with it." },
  { icon: FileSignature, title: 'Signed audit log', text: 'Every decision is signed and chained, ready for disputes and regulators.' },
]

// Tiny hand-rolled highlighter for the JSON snippet.
export function Code({ url = 'https://agents.certaintybank.example/mcp', passport = 'psp_pip_v3_7Q2L…' }: { url?: string; passport?: string }) {
  const k = (s: string) => <span className="tok-key">{s}</span>
  const v = (s: string) => <span className="tok-str">{s}</span>
  return (
    <pre className="code">
      <code>
        {'{\n  '}
        {k('"mcpServers"')}
        {': {\n    '}
        {k('"certainty-bank"')}
        {': {\n      '}
        {k('"url"')}: {v(`"${url}"`)}
        {',\n      '}
        {k('"auth"')}: {v('"passport"')}
        {',\n      '}
        {k('"passport"')}: {v(`"${passport}"`)}
        {',\n      '}
        {k('"step_up"')}: {v('"signing-key"')}
        {'\n    }\n  }\n}'}
      </code>
    </pre>
  )
}

export default function PluginPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="plugin">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={17} />
        </button>
        <div className="topbar__who">
          <span className="topbar__name">Plugins</span>
          <span className="topbar__role">Certainty Bank</span>
        </div>
      </header>

      <div className="plugin__scroll">
        <div className="plugin__col">
          <section className="p-hero">
            <span className="p-hero__mark">
              <ShieldCheck size={30} />
            </span>
            <div className="p-hero__text">
              <div className="p-hero__badges">
                <span className="p-badge p-badge--ok">Verified</span>
                <span className="p-badge">Connected to Cowork</span>
                <span className="p-badge">6 agents</span>
              </div>
              <h1>Certainty Bank</h1>
              <p>
                One passport, every agent. Plug the bank into any personal agent, and it can pay, borrow and invest
                within limits you sign, and nothing beyond them.
              </p>
            </div>
          </section>

          <section>
            <h2 className="p-h2">What it gives every agent</h2>
            <div className="p-gives">
              {GIVES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="p-give">
                  <Icon size={18} />
                  <div className="p-give__title">{title}</div>
                  <div className="p-give__text">{text}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="p-h2">
              Works with any personal agent <span className="p-count">{PLATFORMS.length}</span>
            </h2>
            <div className="p-platforms">
              {PLATFORMS.map((p) => (
                <div key={p.name} className="p-platform">
                  <img className="p-platform__logo" src={p.logo} alt="" />
                  <span className="p-platform__name">{p.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="p-h2">Built on open standards</h2>
            <div className="p-standards">
              {STANDARDS.map((s) => (
                <span key={s.name} className="p-standard" title={s.what}>
                  <strong>{s.name}</strong>
                  {s.what}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="p-h2">Add it to your agent</h2>
            <Code />
          </section>

          <p className="p-note">Illustrative 2035 integrations. Product names belong to their owners.</p>
        </div>
      </div>
    </div>
  )
}
