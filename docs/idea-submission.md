# HackerEarth Idea submission (copy-ready, not submitted)

Form fields: Title, Description (rich text), Repository URL.

## Title

Kairos: agent passports and intent-bound cards for agent-to-agent commerce

## Repository URL

https://github.com/use-kairos/kairos-procurement-demo

## Description

**Kairos is the transaction layer for AI agents: intent → plan → approval → action → proof.**

Agents will soon buy, borrow and refund on behalf of businesses, often by negotiating with other companies' agents. Each handshake raises three questions: *who is acting, under what authority, and is the transaction backed by real money?* Today a prompt is the only thing between an agent and a payment.

Kairos gives every agent a **passport** that its owner signs: roles, limits, allowed payees, and what needs a human. Before any agent-to-agent deal, Kairos checks the counterparty's passport. Inside the mandate, the agent acts. Outside it, the owner approves on a signing key. Every step lands in a verifiable log.

**Starter Kit 02 (Intent-Bound Purchase Agent).** A bakery's procurement agent checks the cash reserve, negotiates flour with a supplier's agent, and pays with a **single-use virtual card locked to the approved intent**: amount cap, single merchant, one use. A higher amount or a different merchant is declined by the card, not by the prompt. In the build phase we plan to implement this on Airwallex Issuing: cardholder and card creation with spending limits and merchant controls, simulated authorizations, and transaction reconciliation into the proof log.

**Demo:** [PREVIEW URL]. Concept demo: payments, cards, signatures and bank checks are simulated in the browser. No Airwallex integration exists yet.

**Prior work (disclosed).** The demo builds on *Banking 2035*, a concept demo I built in September 2026 for my Granite Fellows group’s Banking 2035 proposal in Singapore (https://banking-2035-demo.vercel.app/). For this application I rebranded it to Kairos and added the agent-to-agent verification, the intent-bound card scene and a guided walkthrough. Change history is in the repository. The Airwallex integration is the work we propose for the build phase.
