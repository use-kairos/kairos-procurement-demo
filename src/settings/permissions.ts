export const RESOURCES = [
  'Balances',
  'Statements',
  'Payments',
  'Refunds',
  'Cards',
  'Credit',
  'Sweeps',
  'Investments',
  'Tax filings',
] as const
export const ACCOUNTS = ['Checking', 'Savings', 'Credit line', 'Card', 'Money-market'] as const
export const PERIODS = ['per payment', 'per day', 'per month'] as const

export type Resource = (typeof RESOURCES)[number]
export type AccountType = (typeof ACCOUNTS)[number]
export type Access = 'Read' | 'Edit'
export type Period = (typeof PERIODS)[number]

export type Rule = {
  id: number
  resource: Resource
  accounts: AccountType[]
  access: Access
  limit: number | null
  period: Period
}

export type Payees = 'known' | 'verified' | 'any'

export type Policy = {
  rules: Rule[]
  payees: Payees
  passportOnly: boolean
  stepUpAbove: number
  stepUpNewPayee: boolean
  stepUpOffHours: boolean
  hours: [string, string]
  validUntil: string
  version: number
}

let nextId = 1
const rule = (resource: Resource, accounts: AccountType[], access: Access, limit: number | null = null, period: Period = 'per payment'): Rule => ({
  id: nextId++,
  resource,
  accounts,
  access,
  limit,
  period,
})
export const newRule = () => rule('Balances', ['Checking'], 'Read')

const base = { passportOnly: true, stepUpNewPayee: true, stepUpOffHours: false, hours: ['08:00', '20:00'] as [string, string], validUntil: '2035-10-28' }

export const DEFAULT_POLICIES: Record<string, Policy> = {
  pip: {
    ...base,
    rules: [rule('Balances', ['Checking'], 'Read'), rule('Payments', ['Checking'], 'Edit', 1000), rule('Payments', ['Checking'], 'Edit', 6000, 'per month')],
    payees: 'known',
    stepUpAbove: 1000,
    version: 3,
  },
  tessa: {
    ...base,
    rules: [rule('Balances', ['Checking', 'Savings'], 'Read'), rule('Statements', ['Checking', 'Savings'], 'Read'), rule('Credit', ['Credit line'], 'Edit', 25000, 'per month')],
    payees: 'verified',
    stepUpAbove: 0,
    version: 2,
  },
  wren: {
    ...base,
    rules: [rule('Balances', ['Checking', 'Savings'], 'Read'), rule('Sweeps', ['Checking', 'Money-market'], 'Edit', 50000, 'per day'), rule('Investments', ['Savings'], 'Read')],
    payees: 'known',
    stepUpAbove: 5000,
    stepUpOffHours: true,
    version: 4,
  },
  otto: {
    ...base,
    rules: [rule('Statements', ['Checking', 'Savings', 'Card'], 'Read'), rule('Tax filings', ['Checking'], 'Read'), rule('Payments', ['Checking'], 'Edit', 10000, 'per month')],
    payees: 'known',
    stepUpAbove: 2000,
    version: 2,
  },
  jules: {
    ...base,
    rules: [rule('Cards', ['Card'], 'Edit', 3000), rule('Balances', ['Card'], 'Read')],
    payees: 'verified',
    stepUpAbove: 3000,
    version: 1,
  },
  sol: {
    ...base,
    rules: [rule('Payments', ['Checking'], 'Read'), rule('Refunds', ['Checking'], 'Edit', 300)],
    payees: 'known',
    stepUpAbove: 300,
    version: 5,
  },
}

const sgd = (n: number) => `SGD ${n.toLocaleString('en-SG')}`
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)
const PAYEE_TEXT: Record<Payees, string> = {
  known: 'only payees Alex has paid before',
  verified: 'any business whose agent carries a verified passport',
  any: 'anyone',
}

// Plain-English summary, like the review step before creating a token.
export function summarize(name: string, p: Policy): string[] {
  const lines = p.rules.map((r) => {
    const where = list(r.accounts.map((a) => a.toLowerCase()))
    if (r.access === 'Read') return `Can read ${r.resource.toLowerCase()} on ${where}.`
    const cap = r.limit ? ` up to ${sgd(r.limit)} ${r.period}` : ''
    return `Can act on ${r.resource.toLowerCase()} from ${where}${cap}.`
  })
  lines.push(`Pays ${PAYEE_TEXT[p.payees]}.`)
  if (p.passportOnly) lines.push('Only deals with agents that show a passport.')
  const ask = [
    p.stepUpAbove > 0 && `above ${sgd(p.stepUpAbove)}`,
    p.stepUpNewPayee && 'for a new payee',
    p.stepUpOffHours && `outside ${p.hours[0]}–${p.hours[1]}`,
  ].filter(Boolean) as string[]
  if (ask.length) lines.push(`Asks Alex on the signing key ${list(ask)}.`)
  lines.push(`${name}'s passport expires on ${p.validUntil}.`)
  return lines
}
