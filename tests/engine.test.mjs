import test from "node:test";
import assert from "node:assert/strict";
import { initial, transition } from "../src/engine.mjs";
const now = 1000;
function approved(scenario = "normal") {
  let s = initial();
  s.scenario = scenario;
  return transition(s, { type: "approve", now });
}
test("only exact approved terms charge once, including repeat execution and replay", () => {
  let s = transition(approved(), { type: "execute", now });
  assert.equal(s.charges.length, 1);
  for (let i = 0; i < 10; i++) {
    s = transition(s, { type: "execute", now });
    s = transition(s, { type: "resume", now });
  }
  assert.equal(s.charges.length, 1);
  assert.equal(s.receipt.id, "sim-payment-001");
});
for (const scenario of ["price", "supplier"])
  test(`${scenario} mismatch blocks before payment`, () => {
    const s = transition(approved(scenario), { type: "execute", now });
    assert.equal(s.stage, "blocked");
    assert.equal(s.charges.length, 0);
  });
test("expired approval cannot execute", () => {
  const s = transition(approved(), { type: "execute", now: 301000 });
  assert.equal(s.stage, "blocked");
  assert.equal(s.charges.length, 0);
});
test("interruption survives serialization and reconciles same provider record", () => {
  let s = transition(approved("interrupt"), { type: "execute", now });
  assert.equal(s.receipt, null);
  assert.equal(s.charges.length, 1);
  s = transition(JSON.parse(JSON.stringify(s)), { type: "resume", now });
  assert.equal(s.stage, "done");
  assert.equal(s.charges.length, 1);
  assert.equal(s.receipt.id, "sim-payment-001");
});
test("payment cannot run without approval", () => {
  assert.equal(
    transition(initial(), { type: "execute", now }).charges.length,
    0,
  );
});
