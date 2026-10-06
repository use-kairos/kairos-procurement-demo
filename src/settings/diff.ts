import type { Payees, Policy, Rule } from './permissions'

// What changed between the signed passport and the draft: drives the "Edited" marks and the signing screen.
export type Sections = { rules: boolean; payees: boolean; stepUp: boolean; validity: boolean }

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const sgd = (n: number | null) => (n ? `SGD ${n.toLocaleString('en-SG')}` : 'no limit')
const onOff = (v: boolean) => (v ? 'on' : 'off')
const PAYEE_TITLE: Record<Payees, string> = { known: 'Known payees', verified: 'Verified businesses', any: 'Anyone' }

export function ruleState(before: Policy, r: Rule): 'new' | 'edited' | null {
  const old = before.rules.find((x) => x.id === r.id)
  if (!old) return 'new'
  return same(old, r) ? null : 'edited'
}

export function changedSections(before: Policy, after: Policy): Sections {
  return {
    rules: !same(before.rules, after.rules),
    payees: before.payees !== after.payees || before.passportOnly !== after.passportOnly,
    stepUp: before.stepUpAbove !== after.stepUpAbove || before.stepUpNewPayee !== after.stepUpNewPayee || before.stepUpOffHours !== after.stepUpOffHours,
    validity: !same(before.hours, after.hours) || before.validUntil !== after.validUntil,
  }
}

function ruleChange(old: Rule, r: Rule): string {
  const parts: string[] = []
  if (old.resource !== r.resource) parts.push(`${old.resource} → ${r.resource}`)
  if (!same(old.accounts, r.accounts)) parts.push(`accounts ${old.accounts.join(', ') || 'none'} → ${r.accounts.join(', ') || 'none'}`)
  if (old.access !== r.access) parts.push(`${old.access} → ${r.access}`)
  if (r.access === 'Edit' && (old.limit !== r.limit || old.period !== r.period)) parts.push(`limit ${sgd(old.limit)} ${old.period} → ${sgd(r.limit)} ${r.period}`)
  return `${r.resource}: ${parts.join(' · ')}`
}

// One plain-English line per change, in form order.
export function diffLines(before: Policy, after: Policy): string[] {
  const out: string[] = []
  for (const r of after.rules) {
    const old = before.rules.find((x) => x.id === r.id)
    if (!old) out.push(`Added: ${r.resource} (${r.access}) on ${r.accounts.join(', ')}`)
    else if (!same(old, r)) out.push(ruleChange(old, r))
  }
  for (const old of before.rules) if (!after.rules.some((x) => x.id === old.id)) out.push(`Removed: ${old.resource} (${old.access})`)
  if (before.payees !== after.payees) out.push(`Who it can pay: ${PAYEE_TITLE[before.payees]} → ${PAYEE_TITLE[after.payees]}`)
  if (before.passportOnly !== after.passportOnly) out.push(`Passport-only agents: ${onOff(before.passportOnly)} → ${onOff(after.passportOnly)}`)
  if (before.stepUpAbove !== after.stepUpAbove) out.push(`Ask me above: ${sgd(before.stepUpAbove)} → ${sgd(after.stepUpAbove)}`)
  if (before.stepUpNewPayee !== after.stepUpNewPayee) out.push(`Ask me for a new payee: ${onOff(before.stepUpNewPayee)} → ${onOff(after.stepUpNewPayee)}`)
  if (before.stepUpOffHours !== after.stepUpOffHours) out.push(`Ask me outside hours: ${onOff(before.stepUpOffHours)} → ${onOff(after.stepUpOffHours)}`)
  if (!same(before.hours, after.hours)) out.push(`Active hours: ${before.hours.join('–')} → ${after.hours.join('–')}`)
  if (before.validUntil !== after.validUntil) out.push(`Expires: ${before.validUntil} → ${after.validUntil}`)
  return out
}
