import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { initial, terms, transition } from "./engine.mjs";
import "./style.css";
// Adapted from Banking 2035 Avatar.tsx; see NOTICE.md.
function Avatar({ id, size = 40 }) {
  return (
    <img
      className="avatar"
      src={`/avatars/${id}.svg`}
      width={size}
      height={size}
      alt=""
    />
  );
}
const key = "kairos-procurement-demo-v1";
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (
      data &&
      ["review", "approved", "blocked", "interrupted", "done"].includes(
        data.stage,
      ) &&
      Array.isArray(data.charges) &&
      Array.isArray(data.events) &&
      ["normal", "price", "supplier", "interrupt"].includes(data.scenario)
    )
      return data;
  } catch {}
  return initial();
}
const scenarioNames = {
  normal: "Approved purchase",
  price: "Price changes after approval",
  supplier: "Supplier changes after approval",
  interrupt: "Payment response interrupted",
};
function App() {
  const [s, setS] = useState(load),
    [storageWarning, setStorageWarning] = useState(false);
  function save(next) {
    setS(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }
  const act = (type) => save(transition(s, { type, now: Date.now() }));
  const current = terms(s.scenario);
  const changed =
    ["price", "supplier"].includes(s.scenario) && s.stage !== "review";
  const copy = {
    review: [
      "A better price. The wrong commitment.",
      "Annual billing saves 18%, but leaves too little cash for payroll. Pip recommends monthly billing.",
    ],
    approved: [
      "Permission has boundaries.",
      "Your approval is bound to one supplier, amount and billing term. Kairos checks the terms again before execution.",
    ],
    blocked: [
      "The purchase stopped here.",
      "The proposed charge differs from your approval. No payment was made. Review new terms before granting a new mandate.",
    ],
    interrupted: [
      "The response stopped. The payment didn’t.",
      "The simulated provider already recorded the payment. Resume by reconciling that record, rather than charging again.",
    ],
    done: [
      "One purchase. A trace you can inspect.",
      "The receipt is linked to the approved terms. Replaying this request retrieves the same payment.",
    ],
  }[s.stage];
  function download() {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              notice:
                "Browser-only simulation. Not bank evidence or proof of delivery.",
              ...s,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "kairos-simulated-evidence.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <header>
        <a
          className="brand"
          href="https://hikairos.app/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/kairos-logo.svg" alt="" />
          KAIROS
        </a>
        <span className="caption">THE TRANSACTION LAYER FOR AI AGENTS</span>
        <span className="demo">Concept demo · simulated payments</span>
      </header>
      <main>
        <aside className="rail">
          <div className="eyebrow">WORKSPACE</div>
          <h2>
            Small team,
            <br />
            clear boundaries.
          </h2>
          <div className="agent selected">
            <Avatar id="pip" />
            <div>
              <strong>Pip</strong>
              <small>Procurement agent</small>
            </div>
          </div>
          <div className="agent">
            <Avatar id="otto" />
            <div>
              <strong>You</strong>
              <small>Approval owner</small>
            </div>
          </div>
          <div className="rail-bottom">
            <div className="eyebrow">TRANSACTION LIFECYCLE</div>
            <ol className="steps">
              {["Intent", "Plan", "Approval", "Action", "Proof"].map((x, i) => (
                <li
                  key={x}
                  className={
                    i <
                    {
                      review: 2,
                      approved: 3,
                      blocked: 3,
                      interrupted: 4,
                      done: 5,
                    }[s.stage]
                      ? "complete"
                      : ""
                  }
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {x}
                </li>
              ))}
            </ol>
            <p className="small">
              Inspired by Banking 2035.
              <br />
              Built around a single purchase.
            </p>
          </div>
        </aside>
        <section className="workspace">
          <div className="topline">
            <span className="eyebrow">PROCUREMENT / REQUEST 001</span>
            <button className="text-button" onClick={() => save(initial())}>
              Reset demo
            </button>
          </div>
          <h1>{copy[0]}</h1>
          <p className="intro">{copy[1]}</p>
          <label className="scenario">
            Explore a scenario
            <select
              value={s.scenario}
              disabled={s.stage !== "review"}
              onChange={(e) =>
                save(transition(s, { type: "scenario", value: e.target.value }))
              }
            >
              {Object.entries(scenarioNames).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <div className="conversation">
            <div className="speaker">
              <Avatar id="otto" size={32} />
              <strong>You</strong>
              <span>Purchase intent</span>
            </div>
            <p className="bubble">
              Get LedgerFlow for our team. Keep enough cash for payroll and at
              least $400 in reserve.
            </p>
            <div className="speaker">
              <Avatar id="pip" size={32} />
              <strong>Pip</strong>
              <span>Plan & recommendation</span>
            </div>
            <div className="proposal">
              <div className="proposal-title">
                LedgerFlow <span>Fictional SaaS supplier</span>
              </div>
              <div className="comparison">
                <div>
                  <small>ANNUAL BILLING</small>
                  <strong>
                    $984 <em>/ year</em>
                  </strong>
                  <p>Cash after payroll: −$234</p>
                  <span>Below reserve</span>
                </div>
                <div className="recommended">
                  <small>MONTHLY BILLING</small>
                  <strong>
                    $100 <em>/ month</em>
                  </strong>
                  <p>Cash after payroll: $650</p>
                  <span>Recommended</span>
                </div>
              </div>
              <p className="math">
                $1,400 balance − $650 payroll − $100 purchase ={" "}
                <strong>$650 remaining</strong>
              </p>
            </div>
          </div>
          {changed && (
            <div className="notice">
              <strong>Terms changed after approval</strong>
              <p>
                Incoming charge: {current.supplier} · ${current.amount} USD ·{" "}
                {current.billing}. The original approval remains LedgerFlow ·
                $100 USD · monthly.
              </p>
            </div>
          )}
          <div className="action-area" aria-live="polite">
            <span className="eyebrow">
              {s.stage === "review"
                ? "YOUR DECISION"
                : s.stage === "done"
                  ? "PAYMENT RECONCILED"
                  : s.stage.toUpperCase()}
            </span>
            <p>
              {s.stage === "review"
                ? "Approve one $100 monthly purchase from LedgerFlow. This demo moves no money."
                : s.events.at(-1)}
            </p>
            {s.stage === "review" ? (
              <button className="primary" onClick={() => act("approve")}>
                Approve $100 monthly purchase <span>→</span>
              </button>
            ) : s.stage === "approved" ? (
              <button className="primary" onClick={() => act("execute")}>
                Check terms & simulate payment <span>→</span>
              </button>
            ) : s.stage === "interrupted" ? (
              <button className="primary" onClick={() => act("resume")}>
                Resume & reconcile payment <span>→</span>
              </button>
            ) : s.stage === "done" ? (
              <button className="primary" onClick={() => act("resume")}>
                Replay request safely <span>↻</span>
              </button>
            ) : (
              <button className="primary" onClick={() => save(initial())}>
                Start a new review <span>→</span>
              </button>
            )}
          </div>
        </section>
        <aside className="evidence">
          <div className="eyebrow">AGENT PASSPORT</div>
          <h2>A scoped mandate.</h2>
          <dl>
            <dt>Supplier</dt>
            <dd>LedgerFlow</dd>
            <dt>Amount / currency</dt>
            <dd>$100 USD</dd>
            <dt>Billing term</dt>
            <dd>Monthly · one purchase</dd>
            <dt>Cash reserve</dt>
            <dd>At least $400 after payroll</dd>
            <dt>Approval</dt>
            <dd>
              {s.approval
                ? "Granted · valid for 5 minutes"
                : "Awaiting your decision"}
            </dd>
          </dl>
          <div className="charge-count">
            <strong>{s.charges.length}</strong>
            <span>simulated charges</span>
          </div>
          <details open>
            <summary>Execution evidence</summary>
            <ol className="events">
              {s.events.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ol>
            {s.receipt && <code>{s.receipt.id}</code>}
            <button className="text-button" onClick={download}>
              Download evidence JSON ↓
            </button>
          </details>
          <details>
            <summary>What is real in this demo?</summary>
            <p>
              Local policy checks, approval binding and recovery logic run in
              your browser. Suppliers, balances, obligations and payments are
              synthetic. State is stored on this device only.
            </p>
            <p>
              Airwallex sandbox cards, server-side enforcement and provider
              reconciliation are proposed hackathon work. A payment receipt does
              not prove service delivery.
            </p>
            <a
              href="https://github.com/use-kairos/kairos-procurement-demo"
              target="_blank"
              rel="noreferrer"
            >
              Source & implementation scope ↗
            </a>
          </details>
          {storageWarning && (
            <p role="alert">
              Browser storage is unavailable. State will not survive a reload.
            </p>
          )}
        </aside>
      </main>
      <footer>
        Approved. Resumable. Verifiable.
        <span>Kairos × Banking 2035 · Idea-stage prototype</span>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
