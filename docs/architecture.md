# Architecture and integration plan

## Current trust boundary

`src/engine.mjs` is a deterministic state transition model. React renders it and saves its output in localStorage. The approved mandate includes supplier, amount, currency, billing term and expiry. Execution compares the current terms with that mandate before creating a simulated payment record.

The interruption scenario intentionally records the simulated provider payment before exposing its receipt to the workflow. Resume reads that same record by request ID. Replay never creates a second charge in this single-request model. The browser stores both sides of the simulation; this is illustrative recovery, not proof of distributed-system correctness. Multiple tabs, malicious state edits and real concurrent requests are outside the model. Reset begins a fresh simulation with a reused illustrative request ID.

## Planned server implementation

1. Persist immutable purchase terms, owner approval and expiry server-side; authorize the user and agent independently.
2. Retrieve sandbox balances. Combine them with explicitly sourced upcoming obligations; do not treat a balance alone as spendable cash.
3. Verify card API fields and sandbox support against the official Airwallex API reference. Map supported currency/amount/category limits to provider controls. Keep exact supplier, billing term and approval checks in the application wherever necessary.
4. Persist a unique purchase ID and operation state before calling the provider. Use documented provider idempotency where available; never assume generic idempotency support across endpoints.
5. Reconcile ambiguous outcomes against provider records. Protect concurrent retries with durable uniqueness/locking. Escalate unresolved outcomes instead of blindly retrying payment.
6. Store provider identifiers and evidence separately from fulfillment status. Payment success does not establish service delivery.

Proposed validation: successful and declined sandbox charges, changed supplier/terms, expired approvals, reserve breach, concurrent duplicate requests, response loss and eventual reconciliation. These are build-period acceptance criteria, not claims of completed integration.

References: [event](https://airwallex.hackerearth.com/), [builder guide](https://airwallexdev.com/guide), [official API reference](https://www.airwallex.com/docs/api).
