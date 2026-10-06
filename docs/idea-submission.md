# HackerEarth — copy-ready Idea submission

Prepared 6 October 2026. This document has not been submitted.

## Title

Kairos — Intent-Bound Procurement

## Repository URL

https://github.com/use-kairos/kairos-procurement-demo

## Description

Kairos is the transaction layer for AI agents: turning a purchase intent into an approved, resumable and verifiable action.

We are applying to Starter Kit 02, Intent-Bound Purchase Agent (Expense & Policy). Our target user is a small team that delegates software purchasing to an AI agent but still needs control over cash commitments and exact purchase terms.

A cheaper subscription is not always the right purchase. In our example, a team has $1,400, an upcoming $650 payroll obligation and a $400 minimum reserve. A $984 annual subscription saves 18% compared with monthly billing, but breaches that reserve. The agent recommends a $100 monthly plan instead.

The owner approves a scoped mandate: supplier, amount, currency, billing term and expiry. Before execution, Kairos checks that the current purchase still matches that mandate. Changed prices or suppliers stop the action. If a payment response is interrupted, the workflow reconciles the existing transaction before attempting another charge. Evidence links the decision, approval and payment outcome; it does not claim to prove service delivery.

Our public repository contains a runnable browser prototype with four scenarios: an approved purchase, a changed price, a changed supplier, and recovery after a simulated payment interruption. It includes policy and recovery tests, a downloadable evidence record and setup instructions. All balances, obligations, suppliers and payments are synthetic. There is no live LLM or Airwallex integration in this prototype.

During the hackathon build period, we propose to add server-side mandate enforcement, Airwallex sandbox balance retrieval, virtual-card issuance and supported spending controls, sandbox charge simulations, and reconciliation against provider transaction records. Exact supplier and billing-term binding will remain application-side responsibilities wherever provider controls cannot express them. We will validate exact API capabilities before claiming enforcement.

Pre-existing work: Kairos is an existing product concept. This prototype adapts selected presentation elements and avatars from Banking 2035, previously developed for Granite Fellows Group 9 in Singapore. That earlier work is disclosed as background, not represented as newly created during the official build period or solely authored by the applicant. The proposed Airwallex integration and server-side execution boundary are future hackathon work, subject to the organizer's rules on reuse.

Existing Banking 2035 reference demo: https://banking-2035-demo.vercel.app/

## Optional demo URL

After deploying this repository to Vercel, paste the resulting public URL here and add it to the description. The older Banking 2035 link above is background, not this new procurement demo.

## Suggested walkthrough (about 3 minutes)

1. Show why annual billing breaches the payroll reserve and approve monthly billing.
2. Execute the allowed simulated payment. Replay the request: the charge count stays at one.
3. Reset, select a price or supplier change, approve the original terms, and show the action blocked before payment.
4. Reset, select the interruption scenario, approve and execute. Reload the page, resume, and download the evidence JSON. Explain that the provider record is browser-simulated; production reconciliation is planned.

## Before you submit

- Add your new Vercel URL after deployment.
- Confirm team details and any organizer questions about pre-existing work.
- Paste Title, Description and Repository URL into the Idea-phase form.
- Save the submission confirmation separately; repository publication is not a HackerEarth submission.
