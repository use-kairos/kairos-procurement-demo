# Kairos · Agent Passport Demo

**Kairos is the transaction layer for AI agents:** intent → plan → approval → action → proof.

An idea-stage concept demo for the [Airwallex Agentic Banking Hackathon](https://airwallex.hackerearth.com/), built on the pre-existing Banking 2035 demo (see [Provenance](#provenance)). Procurement (Starter Kit 02, Intent-Bound Purchase Agent) is one scene in it, not the whole product.

> Concept demo. Every payment, card, signature, identity check and bank check is simulated in the browser. No real money moves, nothing is connected to Airwallex yet, and there is no backend.

## What you see

1. **3D intro.** A desk with a laptop and a signing key. After one second the camera moves into the screen on its own.
2. **Workspace.** Alex runs Lim Bakery with six agents. Each agent acts inside a signed **agent passport** (a mandate: amounts, payees, what needs Alex).
3. **Agent to agent.** Agents negotiate with other companies' agents. Before any deal Kairos answers three questions: *who is acting, under what authority, and is it backed by real money?* An agent without a passport is refused.
4. **Approval.** Anything outside a passport stops for Alex's signing key (Wren, Otto, Tessa).
5. **Action.** Pip pays with a single-use card bound to the approved intent. The card, not the prompt, declines anything else.
6. **Proof.** Six checks and a hash-chained audit log in the Kairos view.

A first-visit guide walks through these steps. [docs/demo-guide.md](docs/demo-guide.md) has a 3-minute script.

## Run

```sh
npm ci
npm run dev      # add ?skip to jump past the intro
npm run build
```

Static Vite + React + three.js app. Vercel: framework Vite, output `dist`, no environment variables.

## Implemented vs simulated vs planned

| | Status |
| --- | --- |
| 3D intro, workspace, agent threads, passport editor, signing-key overlay, plugin onboarding chat | Implemented (front end) |
| Agent conversations, the three-question checks, six Kairos checks, audit log hashes | Scripted / simulated |
| ML-DSA-65 signatures, Singpass liveness, AML screening, bank rails | Concept only, not implemented |
| Intent-bound virtual card and its authorization tests | Simulated; planned on Airwallex Issuing (cardholder, card with limits and merchant controls, simulated authorizations) |

## Provenance

The code is ported unchanged from the private repository `onehumanbeing/banking-2035-demo` at commit `e7908a0` (Banking 2035, Granite Fellows Group 9, Singapore, September 2026; live at https://banking-2035-demo.vercel.app/). Every Kairos change is a separate commit after that baseline. [docs/changes-from-banking-2035.md](docs/changes-from-banking-2035.md) lists them. Asset credits are in [NOTICE.md](NOTICE.md).

Code is MIT licensed. Kairos names and brand artwork are excluded from that license. Third-party assets keep their own terms.
