export type CompanyId = 'bakery' | 'ventures'

// Lim Bakery already runs agents; Lim Ventures starts from zero with only a chat.
export const COMPANIES: { id: CompanyId; name: string; legal: string; hint: string }[] = [
  { id: 'bakery', name: 'Lim Bakery', legal: 'Lim Bakery Pte. Ltd.', hint: '6 agents · bank connected' },
  { id: 'ventures', name: 'Lim Ventures', legal: 'Lim Ventures Pte. Ltd.', hint: 'Chat only · no agents yet' },
]
