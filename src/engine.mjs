export const initial = () => ({
  stage: "review",
  scenario: "normal",
  approval: null,
  charges: [],
  events: ["Purchase request received."],
  receipt: null,
});
export const terms = (s) => ({
  supplier: s === "supplier" ? "Unknown reseller" : "LedgerFlow",
  amount: s === "price" ? 110 : 100,
  currency: "USD",
  billing: "monthly",
});
export const fingerprint = (t) => JSON.stringify(t);
export function transition(state, action) {
  const s = structuredClone(state),
    t = terms(s.scenario);
  const log = (text) => s.events.push(text);
  if (action.type === "scenario" && s.stage === "review") {
    s.scenario = action.value;
    return s;
  }
  if (action.type === "approve" && s.stage === "review") {
    s.approval = { terms: terms("normal"), expires: action.now + 300000 };
    s.stage = "approved";
    log("Owner approved LedgerFlow · USD 100 · monthly · valid for 5 minutes.");
  } else if (action.type === "execute" && s.stage === "approved") {
    if (
      !s.approval ||
      action.now >= s.approval.expires ||
      fingerprint(t) !== fingerprint(s.approval.terms)
    ) {
      s.stage = "blocked";
      log(
        "Blocked before payment: current terms or approval expiry do not match the mandate.",
      );
      return s;
    }
    if (1400 - 650 - t.amount < 400) {
      s.stage = "blocked";
      log("Blocked: payroll reserve would fall below USD 400.");
      return s;
    }
    const existing = s.charges.find((c) => c.requestId === "purchase-001");
    const receipt = existing || {
      id: "sim-payment-001",
      requestId: "purchase-001",
      ...t,
      status: "simulated_success",
    };
    if (!existing) s.charges.push(receipt);
    if (s.scenario === "interrupt") {
      s.stage = "interrupted";
      log(
        "Simulated provider recorded payment. Response interrupted before receipt was saved.",
      );
    } else {
      s.receipt = receipt;
      s.stage = "done";
      log("One simulated payment recorded; receipt linked to approved terms.");
    }
  } else if (
    action.type === "resume" &&
    ["interrupted", "done"].includes(s.stage)
  ) {
    s.receipt = s.charges.find((c) => c.requestId === "purchase-001") || null;
    s.stage = s.receipt ? "done" : "blocked";
    log(
      s.receipt
        ? "Reconciled existing payment by request ID. No new charge."
        : "No provider record found; stopped for review.",
    );
  }
  return s;
}
