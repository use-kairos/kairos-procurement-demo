// First-visit guide: the Kairos lifecycle, pointed at parts of the original demo.
export type TourStep = { stage: string; title: string; text: string; target: string }

export const TOUR: TourStep[] = [
  {
    stage: 'Intent',
    title: 'An owner, six agents, one goal',
    text: "Alex runs Lim Bakery with six agents. Pip's goal: restock flour before Thursday, inside a passport Alex signed (≤ SGD 1,000, known suppliers).",
    target: '.agent-row.is-active',
  },
  {
    stage: 'Plan',
    title: 'Agent to agent, with a passport check',
    text: "Pip plans, then negotiates with the supplier's agent. Before any deal Kairos answers: who is acting, under what authority, and is it backed by real money?",
    target: '.hs',
  },
  {
    stage: 'Approval',
    title: 'Checks, then the signing key',
    text: "Kairos runs six checks: registered agent, passport, owner's key, mandate, AML. The payment is then confirmed on Alex's hardware signing key (auto-confirmed in this demo).",
    target: '.bv-checks',
  },
  {
    stage: 'Action',
    title: 'The card enforces the intent',
    text: 'Inside the mandate, Kairos issues a single-use card locked to this order. The card, not the prompt, refuses anything else.',
    target: '.bcard',
  },
  {
    stage: 'Proof',
    title: 'A receipt for every decision',
    text: 'Each step lands in a hash-chained audit log. Try Sol next: an agent with no passport asks for a refund, and nothing moves.',
    target: '.bv-trail',
  },
]
